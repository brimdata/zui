export type Lake = {
  id: string
  name: string
  host: string
  port: string
  version?: string
  authType: AuthType
  authData?: AuthData
}

export type AuthType = "none" | "auth0"

export type AuthData = Auth0Data

export interface Auth0Data {
  audience: string
  clientId: string
  domain: string
  accessToken?: string
}

export type LakesState = {
  [key: string]: Lake
}

export type LakeAction = LAKE_ADD | LAKE_REMOVE | LAKE_SET_AUTH0_TOKEN

export type LAKE_REMOVE = {
  type: "$LAKE_REMOVE"
  id: string
}

export type LAKE_ADD = {
  type: "$LAKE_ADD"
  lake: Lake
}

export type LAKE_SET_AUTH0_TOKEN = {
  type: "$LAKE_SET_AUTH0_TOKEN"
  lakeId: string
  accessToken: string
}
