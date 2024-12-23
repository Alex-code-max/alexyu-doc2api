import JSZip from "jszip"

import { urlToCamelCase } from "./common"

/**
 * API 数据结构
 */
interface ApiData {
  api: {
    interfaceType: string // 接口类型
    accessPath: string // 访问路径
    description: string // 接口描述
    requestParameters: Array<{ name: string; description: string }> // 请求参数
    responseParameters: Array<{ name: string; description: string }> // 响应参数
  }
}

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

  apiDataArray.forEach((apiDataObj) => {
    const { api } = apiDataObj

    // 提取 URL 的第一个路径段作为文件名的一部分
    const pathSegments = api.accessPath.split("/").filter(Boolean)
    const remainingPath = pathSegments.slice(1).join("/") || "default" // 去掉第一个路径段，若没有剩余路径则使用"default"
    const fileName = `${remainingPath}.js` // 使用剩余路径命名文件

    // 生成文件内容，支持 import
    // TODO:这里api的名称需要文档修改格式
    const jsContent = `
/**
 * API接口
 * Path: ${api.accessPath}
 * Type: ${api.interfaceType}
 * Description: ${api.description}
 */

import { post } from '@/plugin/axios/helper.js';

export function ${urlToCamelCase(api.accessPath)}(data) {
  return post('${api.accessPath}', data, {
    hostType: 'JOLLY_DPP',
  });
}
    `

    // 将文件内容添加到 ZIP 文件中
    zip.file(fileName, jsContent)
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
