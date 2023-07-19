import {createCommand} from "./command"

export const openQuery = createCommand("openQuery", ({api}, id: string) => {
  api.queries.open(id)
})
