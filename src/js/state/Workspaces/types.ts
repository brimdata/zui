export type Workspace = {
  id: string
  name: string
  host: string
  port: string
  version?: string
  authType: AuthType
  authData?: AuthData
}

export type AuthType = "none" | "auth0" | ""

export type AuthData = Auth0Data

export interface Auth0Data {
  clientId: string
  domain: string
  accessToken?: string
}

export type WorkspacesState = {
  [key: string]: Workspace
}

export type WorkspaceAction =
  | WORKSPACE_REMOVE
  | WORKSPACE_ADD
  | WORKSPACE_SET_AUTH0_TOKEN

export type WORKSPACE_REMOVE = {
  type: "WORKSPACE_REMOVE"
  id: string
}

export type WORKSPACE_ADD = {
  type: "WORKSPACE_ADD"
  workspace: Workspace
}

export type WORKSPACE_SET_AUTH0_TOKEN = {
  type: "WORKSPACE_SET_AUTH0_TOKEN"
  workspaceId: string
  accessToken: string
}
