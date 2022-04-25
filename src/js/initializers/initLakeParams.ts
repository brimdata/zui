import Current from "../state/Current"
import Lakes from "../state/Lakes"
import {Lake} from "../state/Lakes/types"
import {Store} from "../state/types"

export const defaultLake = (): Lake => {
  const port = global.mainArgs.lakePort.toString()
  return {
    host: "http://localhost",
    port,
    id: `localhost:${port}`,
    name: "Local Lake",
    authType: "none",
  }
}

const setupDefaultLake = () => (dispatch, _) => {
  dispatch(Lakes.add(defaultLake()))
}

export const isDefaultLake = (l: Lake): boolean => {
  const {host, port, id} = l
  const d = defaultLake()
  return id === d.id && host === d.host && port === d.port
}

export default function (store: Store) {
  const existingLake = Current.getLake(store.getState())
  if (!existingLake) {
    store.dispatch(setupDefaultLake())
  }
}
