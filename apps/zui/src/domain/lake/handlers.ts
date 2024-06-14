import {Client} from "@brimdata/zed-js"
import {createHandler} from "src/core/handlers"
import {Lake} from "src/js/models/lake"
import Current from "src/js/state/Current"
import {validateToken} from "src/core/auth0/utils"
import {getAuthCredentials} from "src/js/flows/lake/getAuthCredentials"
import Lakes from "src/js/state/Lakes"
import LakeStatuses from "src/js/state/LakeStatuses"

export const getAuthToken = createHandler(async ({dispatch}, lake: Lake) => {
  if (!lake.authType) return null
  if (lake.authType === "none") return null
  const token = lake.authData.accessToken
  if (validateToken(token)) {
    return token
  } else {
    const newToken = await dispatch(getAuthCredentials(lake))
    if (newToken) {
      dispatch(Lakes.setAccessToken({lakeId: lake.id, accessToken: newToken}))
      return newToken
    } else {
      dispatch(LakeStatuses.set(lake.id, "login-required"))
      throw new Error("Login Required")
    }
  }
})

export const createClient = createHandler(async ({select}) => {
  const lake = select(Current.mustGetLake)
  const auth = await getAuthToken(lake)
  return new Client(lake.getAddress(), {auth})
})

type Options = {
  signal?: AbortSignal
}

export const query = createHandler(
  async (ctx, text: string, options: Options = {}) => {
    const client = await createClient()
    return await client.query(text, {signal: options.signal})
  }
)
