import {Store} from "../state/types"
import Lakes from "../state/Lakes"
import Current from "../state/Current"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import {Lake} from "../state/Lakes/types"

export const defaultWorkspace = (): Lake => {
  const port = global.mainArgs.lakePort.toString()
  return {
    host: "http://localhost",
    port,
    id: `localhost:${port}`,
    name: "Local Lake",
    authType: "none"
  }
}

const setupDefaultWorkspace = () => (dispatch, _) => {
  dispatch(Lakes.add(defaultWorkspace()))
}

export const isDefaultWorkspace = (ws: Lake): boolean => {
  const {host, port, id} = ws
  const d = defaultWorkspace()
  return id === d.id && host === d.host && port === d.port
}

export default function(store: Store) {
  const {id} = getUrlSearchParams()
  global.windowId = id

  const existingWorkspace = Current.getWorkspace(store.getState())
  if (!existingWorkspace) {
    store.dispatch(setupDefaultWorkspace())
  }
}
