import toast from "react-hot-toast"
import {toAccessTokenKey, toRefreshTokenKey} from "../../../core/auth0/utils"
import {isDefaultLake} from "../../initializers/initLakeParams"
import Pools from "../../state/Pools"
import {Thunk} from "../../state/types"
import Lakes from "../../state/Lakes"
import {LakeAttrs} from "../../state/Lakes/types"
import LakeStatuses from "../../state/LakeStatuses"
import {invoke} from "src/core/invoke"

const removeLake =
  (l: LakeAttrs): Thunk =>
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
    toast(`Removed lake "${name}"`)
  }

export default removeLake
