import Lakes from "../state/Lakes"
import {LakeAttrs} from "../state/Lakes/types"

// These need to be moves to some renderer lake model
export const defaultLake = (): LakeAttrs => {
  const port = global.mainArgs.lakePort.toString()
  const user = global.appMeta.userName
  return Lakes.getDefaultLake(port, user)
}

// These need to be moves to some renderer lake model
export const isDefaultLake = (l: LakeAttrs): boolean => {
  const {host, port, id} = l
  const d = defaultLake()
  return id === d.id && host === d.host && port === d.port
}
