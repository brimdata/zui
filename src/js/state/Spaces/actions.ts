import {
  SPACES_DETAIL,
  SPACES_INGEST_PROGRESS,
  SPACES_INGEST_WARNING_APPEND,
  SPACES_INGEST_WARNING_CLEAR,
  SPACES_SET,
  SPACES_REMOVE,
  Space,
  SPACES_RENAME,
  SPACES_WORKSPACE_REMOVE
} from "./types"

export default {
  setSpaces: (workspaceId: string, spaces: Partial<Space>[]): SPACES_SET => ({
    type: "$SPACES_SET",
    workspaceId,
    spaces: spaces || []
  }),

  setDetail: (workspaceId: string, space: any): SPACES_DETAIL => ({
    type: "$SPACES_DETAIL",
    workspaceId,
    space
  }),

  rename: (
    workspaceId: string,
    spaceId: string,
    newName: string
  ): SPACES_RENAME => ({
    type: "$SPACES_RENAME",
    workspaceId,
    spaceId,
    newName
  }),

  remove: (workspaceId: string, spaceId: string): SPACES_REMOVE => ({
    type: "$SPACES_REMOVE",
    workspaceId,
    spaceId
  }),

  removeForWorkspace: (workspaceId: string): SPACES_WORKSPACE_REMOVE => ({
    type: "$SPACES_WORKSPACE_REMOVE",
    workspaceId
  }),

  setIngestProgress: (
    workspaceId: string,
    spaceId: string,
    value: number | null
  ): SPACES_INGEST_PROGRESS => ({
    type: "$SPACES_INGEST_PROGRESS",
    workspaceId,
    spaceId,
    value
  }),

  appendIngestWarning: (
    workspaceId: string,
    spaceId: string,
    warning: string
  ): SPACES_INGEST_WARNING_APPEND => ({
    type: "$SPACES_INGEST_WARNING_APPEND",
    workspaceId,
    spaceId,
    warning
  }),

  clearIngestWarnings: (
    workspaceId: string,
    spaceId: string
  ): SPACES_INGEST_WARNING_CLEAR => ({
    type: "$SPACES_INGEST_WARNING_CLEAR",
    workspaceId,
    spaceId
  })
}
