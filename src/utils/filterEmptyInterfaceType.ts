import type { ApiData } from "~types/common"

function filterEmptyInterfaceType(docs: ApiData[]): ApiData[] {
  return docs.filter((doc) => doc.api.interfaceType?.trim() !== "")
}
export default filterEmptyInterfaceType
