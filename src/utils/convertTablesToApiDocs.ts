import type { ApiData } from "~types/common"

interface TableRow {
  [key: string]: string // 动态键值对
}

interface TableData {
  tableId: string
  data: TableRow[]
}

function convertTablesToApiDocs(tables: TableData[]): ApiData[] {
  return tables
    .map((table) => {
      const rows = table.data
      const dynamicKey = Object.keys(rows[0] || {}).find(
        (key) => key !== "工程"
      ) // 动态字段名
      if (!dynamicKey) return null // 如果未找到动态字段，跳过

      const apiDocument: ApiData = {
        api: {
          interfaceType: "",
          accessPath: "",
          description: "",
          requestParameters: "",
          responseParameters: ""
        }
      }

      for (const row of rows) {
        const fieldName = row["工程"]?.trim() // 固定字段名
        const fieldValue = row[dynamicKey]?.trim() // 动态字段值

        if (!fieldName || !fieldValue) continue

        switch (fieldName) {
          case "接口类型":
            apiDocument.api.interfaceType = fieldValue
            break
          case "访问路径":
            apiDocument.api.accessPath = fieldValue
            break
          case "说明":
            apiDocument.api.description = fieldValue
            break
          case "请求参数":
            // apiDocument.api.requestParameters = parseParameters(fieldValue)
            apiDocument.api.requestParameters = fieldValue
            break
          case "响应参数":
            // apiDocument.api.responseParameters = parseParameters(fieldValue)
            apiDocument.api.responseParameters = fieldValue
            break
        }
      }

      return apiDocument.api.interfaceType ? apiDocument : null // 只返回有效数据
    })
    .filter((doc): doc is ApiData => doc !== null) // 过滤无效数据
}

function parseParameters(
  params: string
): { name: string; description: string }[] {
  return params
    .split(/[\n,]/)
    .map((param) => {
      const [name, description] = param.split("：").map((str) => str.trim())
      return name && description ? { name, description } : null
    })
    .filter(
      (param): param is { name: string; description: string } => param !== null
    )
}
export default convertTablesToApiDocs
