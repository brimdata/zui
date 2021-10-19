import {getGroupById} from "./selectors"
import {intersection} from "lodash"

export const isBrimLib = (ids: string[]) => (_, getState) => {
  const brimIds = [
    "brim",
    ...getGroupById("brim")(getState())?.items.map((i) => i.id)
  ]
  return intersection(ids, brimIds).length > 0
}
