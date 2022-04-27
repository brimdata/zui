import tabHistory from "src/app/router/tab-history"
import {lakesPath} from "src/app/router/utils/paths"
import toast from "react-hot-toast"
import {toAccessTokenKey, toRefreshTokenKey} from "../../auth0/utils"
import ipc from "../../electron/ipc"
import invoke from "../../electron/ipc/invoke"
import {isDefaultLake} from "../../initializers/initLakeParams"
import Investigation from "../../state/Investigation"
import Pools from "../../state/Pools"
import {Thunk} from "../../state/types"
import Lakes from "../../state/Lakes"
import {Lake} from "../../state/Lakes/types"
import LakeStatuses from "../../state/LakeStatuses"

const removeLake =
  (l: Lake): Thunk =>
  (dispatch, _getState) => {
    const {name, id, authType} = l

    if (isDefaultLake(l)) throw new Error("Cannot remove the default lake")

    // remove creds from keychain
    if (authType === "auth0") {
      invoke(ipc.secrets.deleteKey(toAccessTokenKey(id)))
      invoke(ipc.secrets.deleteKey(toRefreshTokenKey(id)))
    }
    dispatch(Investigation.clearLakeInvestigation(id))
    dispatch(Pools.removeAll(id))
    dispatch(LakeStatuses.remove(id))
    dispatch(Lakes.remove(id))

    dispatch(tabHistory.push(lakesPath()))
    toast(`Removed lake "${name}"`)
  }

export default removeLake
