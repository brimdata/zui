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
