import {getGroupById} from "./selectors"
import {intersection} from "lodash"

export const isBrimLib = (ids: string[]) => (_, getState) => {
  const brimIds = [
    "brim",
    ...getGroupById("brim")(getState())?.items.map((i) => i.id)
  ]
  return intersection(ids, brimIds).length > 0
}

export const isChildOf = (id: string, ids: string[]) => (_, getState) => {
  const check = getGroupById(id)(getState())?.items.map((i) => i.id)
  return intersection(ids, check).length > 0
}
