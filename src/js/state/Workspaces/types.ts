export type Workspace = {
  id: string
  name: string
  host: string
  port: string
  version?: string
  auth?: WorkspaceAuth
}

export type WorkspaceAuth = {
  clientId: string
  domain: string
  accessToken?: string
}

export type WorkspacesState = {
  [key: string]: Workspace
}

export type WorkspaceAction = WORKSPACE_REMOVE | WORKSPACE_ADD

export type WORKSPACE_REMOVE = {
  type: "WORKSPACE_REMOVE"
  id: string
}

export type WORKSPACE_ADD = {
  type: "WORKSPACE_ADD"
  workspace: Workspace
}
