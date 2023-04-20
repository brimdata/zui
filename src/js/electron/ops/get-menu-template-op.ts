import {menus} from "src/zui"
import {createOperation} from "../operations"

export const getMenuTemplateOp = createOperation(
  "getMenuTemplateOp",
  (_, name: string) => {
    return menus.get(name).template
  }
)
export type GetMenuTemplateOp = typeof getMenuTemplateOp
