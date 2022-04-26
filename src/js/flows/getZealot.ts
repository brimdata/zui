import {validateToken} from "../auth0/utils"
import {BrimLake} from "../brim"
import Current from "../state/Current"
import Lakes from "../state/Lakes"
import {Thunk} from "../state/types"
import LakeStatuses from "../state/LakeStatuses"
import {getAuthCredentials} from "./lake/getAuthCredentials"
import {Client} from "@brimdata/zealot"

export const getZealot =
  (lake?: BrimLake, env?: "node" | "web"): Thunk<Promise<Client>> =>
  async (dispatch, getState) => {
    const l = lake || Current.mustGetLake(getState())
    const auth = await dispatch(getAuthToken(l))
    return new Client(l.getAddress(), {auth, env})
  }

const getAuthToken =
  (lake: BrimLake): Thunk<Promise<string>> =>
  async (dispatch) => {
    if (!lake.authType) return null
    if (lake.authType === "none") return null
    const token = lake.authData.accessToken
    if (validateToken(token)) {
      return token
    } else {
      const newToken = await dispatch(getAuthCredentials(lake))
      if (newToken) {
        dispatch(Lakes.setLakeToken(lake.id, newToken))
        return newToken
      } else {
        dispatch(LakeStatuses.set(lake.id, "login-required"))
        throw new Error("Login Required")
      }
    }
  }
