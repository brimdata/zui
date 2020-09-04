

export const setSpaceId = (id: string | null, tabId?: string) => ({
  type: "CURRENT_SPACE_SET",
  id,
  tabId
});

export const setConnectionId = (id: string | null) => ({
  type: "CURRENT_CONNECTION_SET",
  id
});