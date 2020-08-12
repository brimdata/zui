/* @flow */

import activeTabSelect from "../Tab/activeTabSelect"

export const getSpaceId = activeTabSelect((state) => state.current.spaceId)
export const getConnectionId = activeTabSelect(
  (state) => state.current.connectionId
)
