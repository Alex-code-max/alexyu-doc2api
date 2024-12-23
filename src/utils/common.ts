import type { ApiData, TableData } from "~types/common"

export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

interface TableRow {
  [key: string]: string
}

export function parseMultipleTablesToJSON(
  tables: NodeListOf<HTMLTableElement>
): TableData[] {
  const parsedTables: TableData[] = []

  tables.forEach((table, tableIndex) => {
    const rows: TableRow[] = []
    const headers: string[] = []

    // 提取表头
    const headerRow = table.querySelector("thead tr")
    if (headerRow) {
      headerRow.querySelectorAll("th").forEach((th) => {
        headers.push(th.textContent?.trim() || "")
      })
    } else {
      // 如果没有 thead，用第一个 tr 作为表头
      const firstRow = table.querySelector("tr")
      if (firstRow) {
        firstRow.querySelectorAll("th, td").forEach((cell) => {
          headers.push(cell.textContent?.trim() || "")
        })
      }
    }

    // 提取表体
    const bodyRows = table.querySelectorAll("tbody tr, tr")
    bodyRows.forEach((row, rowIndex) => {
      if (
        rowIndex === 0 &&
        headers.length > 0 &&
        !table.querySelector("thead")
      ) {
        return // 跳过作为表头的第一行
      }

      const rowData: TableRow = {}
      row.querySelectorAll("td, th").forEach((cell, cellIndex) => {
        const key = headers[cellIndex] || `Column ${cellIndex + 1}`
        rowData[key] = cell.textContent?.trim() || ""
      })
      rows.push(rowData)
    })

    // 添加当前表格的解析结果
    parsedTables.push({
      tableId: table.id || `table-${tableIndex + 1}`, // 优先使用 id，否则生成一个唯一编号
      data: rows
    })
  })

  return parsedTables
}

/**
 * 将 URL 字符串转换为驼峰命名格式
 * @param url - 输入的 URL 字符串
 * @returns 转换后的驼峰命名字符串
 */
export function urlToCamelCase(url: string): string {
  return url
    .split(/[-_/]/) // 以连字符、下划线或斜杠分割
    .filter(Boolean) // 过滤掉空字符串
    .map((segment, index) => {
      // 如果是第一个元素则小写，其他元素首字母大写
      if (index === 0) {
        return segment.toLowerCase() // 第一个单词小写
      }
      return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase() // 其他单词首字母大写
    })
    .join("") // 连接成一个字符串
}
