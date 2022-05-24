import {getGroupById} from "./selectors"
import {intersection} from "lodash"

export const isChildOf = (id: string, ids: string[]) => (_, getState) => {
  const check = getGroupById(id)(getState())?.items.map((i) => i.id)
  return intersection(ids, check).length > 0
}
