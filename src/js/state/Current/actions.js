/* @flow */

export const setSpaceId = (id: string | null) => ({
  type: "CURRENT_SPACE_SET",
  id
})

export const setConnectionId = (id: string | null) => ({
  type: "CURRENT_CONNECTION_SET",
  id
})
