import {Store} from "../state/types"
import Lakes from "../state/Lakes"
import Current from "../state/Current"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import {Lake} from "../state/Lakes/types"

const setupDefaultWorkspace = () => (dispatch, _) => {
  const host = "http://localhost"
  const port = "9867"
  const ws: Lake = {
    host,
    port,
    id: "localhost:9867",
    name: "localhost:9867",
    authType: "none"
  }
  dispatch(Lakes.add(ws))
}

export const isDefaultWorkspace = (ws: Lake): boolean => {
  const {host, port, id} = ws
  return (
    id === "localhost:9867" && host === "http://localhost" && port === "9867"
  )
}

export default function(store: Store) {
  const {id} = getUrlSearchParams()
  global.windowId = id

  const existingWorkspace = Current.getWorkspace(store.getState())

  if (!existingWorkspace) {
    store.dispatch(setupDefaultWorkspace())
  }
}
