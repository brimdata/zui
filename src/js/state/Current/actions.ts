export const setSpaceId = (id: string | null, tabId?: string) => ({
  type: "CURRENT_SPACE_SET",
  id,
  tabId
})

export const setWorkspaceId = (id: string | null) => ({
  type: "CURRENT_WORKSPACE_SET",
  id
})
