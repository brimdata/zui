import {getGroupById} from "./selectors"

export const isBrimLib = (id: string) => (_, getState) => {
  const brimQuery = getGroupById("brim")(getState())
  return id === "brim" || brimQuery.items.map((item) => item.id).includes(id)
}
