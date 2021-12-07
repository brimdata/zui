import {Store} from "../state/types"
import Workspaces from "../state/Workspaces"
import Current from "../state/Current"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import {Workspace} from "../state/Workspaces/types"

export const defaultWorkspace = (): Workspace => {
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
  dispatch(Workspaces.add(defaultWorkspace()))
}

export const isDefaultWorkspace = (ws: Workspace): boolean => {
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
