import tabHistory from "src/app/router/tab-history"
import {lakesPath} from "src/app/router/utils/paths"
import toast from "react-hot-toast"
import {toAccessTokenKey, toRefreshTokenKey} from "../../auth0/utils"
import {isDefaultLake} from "../../initializers/initLakeParams"
import Pools from "../../state/Pools"
import {Thunk} from "../../state/types"
import Lakes from "../../state/Lakes"
import {Lake} from "../../state/Lakes/types"
import LakeStatuses from "../../state/LakeStatuses"
import {invoke} from "src/core/invoke"

const removeLake =
  (l: Lake): Thunk =>
  (dispatch, _getState) => {
    const {name, id, authType} = l

    if (isDefaultLake(l)) throw new Error("Cannot remove the default lake")

    // remove creds from keychain
    if (authType === "auth0") {
      invoke("deleteSecretOp", toAccessTokenKey(id))
      invoke("deleteSecretOp", toRefreshTokenKey(id))
    }
    dispatch(Pools.removeAll(id))
    dispatch(LakeStatuses.remove(id))
    dispatch(Lakes.remove(id))
    dispatch(tabHistory.push(lakesPath()))
    toast(`Removed lake "${name}"`)
  }

export default removeLake
