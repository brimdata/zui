export type WorkspaceStatusesState = {
  [workspaceId: string]: WorkspaceStatus
}

export type WorkspaceStatus =
  | null
  | "connected"
  | "disconnected"
  | "retrying"
  | "authenticating"
  | "login"

export type WorkspaceStatusesAction =
  | WORKSPACE_STATUSES_SET
  | WORKSPACE_STATUSES_REMOVE

export type WORKSPACE_STATUSES_SET = {
  type: "WORKSPACE_STATUSES_SET"
  workspaceId: string
  status: WorkspaceStatus
}

export type WORKSPACE_STATUSES_REMOVE = {
  type: "WORKSPACE_STATUSES_REMOVE"
  workspaceId: string
}
