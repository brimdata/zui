import {Thunk} from "../../state/types"
import Current from "../../state/Current"
import Notice from "../../state/Notice"
import LakeStatuses from "../../state/LakeStatuses"
import {Client} from "@brimdata/zealot"

export const checkStatus = (): Thunk => (dispatch, getState) => {
  const {host, port, id} = Current.getLake(getState())
  const hostPort = port ? [host, port].join(":") : host

  // create default zealot client
  const zealot = new Client("http//:" + hostPort)

  return zealot.version().then(() => {
    dispatch(LakeStatuses.set(id, "connected"))
    dispatch(Notice.dismiss())
  })
}
