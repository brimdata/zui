export type CurrentState = {
  workspaceId: string | null
  spaceId: string | null
}

export type CurrentAction = CURRENT_SPACE_SET | CURRENT_WORKSPACE_SET

export type CURRENT_SPACE_SET = {
  type: "CURRENT_SPACE_SET"
  id: string | null
}

export type CURRENT_WORKSPACE_SET = {
  type: "CURRENT_WORKSPACE_SET"
  id: string | null
}
