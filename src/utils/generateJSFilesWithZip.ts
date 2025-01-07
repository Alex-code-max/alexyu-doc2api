import JSZip from "jszip"

import type { ApiData } from "~types/common"

import { urlToCamelCase } from "./common"

/**
 * 根据 JSON 数据生成多个 JS 文件并保存到 ZIP 文件中
 * @param apiDataArray - API 数据对象数组
 * @param zipFileName - 生成的 ZIP 文件名称
 */
async function generateJSFilesWithZip(
  apiDataArray: ApiData[],
  zipFileName: string
): Promise<void> {
  const zip = new JSZip()
  const folderContents: Record<string, string[]> = {} // 用于按第二路径分组存储 API 数据

  apiDataArray.forEach((apiDataObj) => {
    const { api } = apiDataObj

    // 提取路径段
    const pathSegments = api.accessPath.split("/").filter(Boolean)
    const mainFolder = pathSegments[1] || "default" // 第二路径段作为主文件夹名称
    const accessSubPath = pathSegments.filter((_, index) => index > 0).join("/") // 除第一路径段外的路径段
    // 使用 accessPath 转换为驼峰命名法
    const methodName = urlToCamelCase(accessSubPath)

    // 生成 API 文件内容
    const apiContent = `
/**
 * Path: ${api.accessPath}
 * Type: ${api.interfaceType}
 * RequestParameters: \"${api.requestParameters}\"
 * ResponseParameters: \"${api.responseParameters}\"
 * Description: ${api.description}
 */
function ${methodName}(data) {
  return post('${api.accessPath}', data, {
    hostType: 'JOLLY_DPP',
  });
}
    `

    // 将 API 数据添加到对应的文件夹
    if (!folderContents[mainFolder]) {
      folderContents[mainFolder] = []
    }
    folderContents[mainFolder].push(apiContent)
  })

  // 为每个文件夹生成 index.js 文件
  Object.entries(folderContents).forEach(([folderName, apis]) => {
    let indexContent = `import { post } from '@/plugin/axios/helper.js';\n`

    apis.forEach((apiContent, idx) => {
      indexContent += apiContent
    })

    indexContent += `
/**
 * 导出 ${folderName} 组的 API 数据
 */
export {
  ${apis.map((_, idx) => apis[idx].match(/function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/)?.[1]).join(",\n  ")}
};
    `

    // 创建文件并添加 ${folderName}.js 文件
    zip?.file(`${folderName}.js`, indexContent) // 添加 index.js 文件
  })

  // 生成 ZIP 文件并触发下载
  const content = await zip.generateAsync({ type: "blob" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(content)
  link.download = zipFileName // 下载的文件名
  link.click()

  // 释放 URL 对象
  URL.revokeObjectURL(link.href)
}
export default generateJSFilesWithZip
