import type { TableData } from "~types/common"

interface TableRow {
  [key: string]: string
}

function parseMultipleTablesToJSON(
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

export default parseMultipleTablesToJSON
