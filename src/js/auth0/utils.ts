import jwtDecode, {JwtPayload} from "jwt-decode"

export const validateToken = (token: string): boolean => {
  if (!token) return false

  try {
    const {exp} = jwtDecode<JwtPayload>(token)
    // if token has not expired, return it
    if (Date.now() < exp * 1000) {
      return true
    }
  } catch (e) {
    console.error("invalid token: ", e)
  }

  return false
}
const keytarServiceSuffix = "brim-oauth"

// utils for generating auth0 namespaces in os default keychain (facilitated by keytar)
export const toAccessTokenKey = (id: string): string =>
  [id, "AT", keytarServiceSuffix].join("-")
export const toRefreshTokenKey = (id: string): string =>
  [id, "RT", keytarServiceSuffix].join("-")

interface StateArgs {
  lakeId: string
  windowId: string
}

// utils for formatting data to go into the 'state' query param
export const serializeState = ({lakeId, windowId}: StateArgs): string => {
  return [lakeId, windowId].join(",")
}
export const deserializeState = (state: string): StateArgs => {
  const stateArr = state.split(",")
  if (stateArr.length < 2) return null

  return {lakeId: stateArr[0], windowId: stateArr[1]}
}
