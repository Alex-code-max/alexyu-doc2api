/**
 * API 数据结构
 */
interface ApiData {
  api: {
    interfaceType: string // 接口类型
    accessPath: string // 访问路径
    description: string // 接口描述
    // requestParameters: Array<{ name: string; description: string }> // 请求参数
    // responseParameters: Array<{ name: string; description: string }> // 响应参数
    requestParameters: string // 请求参数
    responseParameters: string // 响应参数
  }
}

export interface TableData {
  tableId: string
  data: TableRow[]
}
