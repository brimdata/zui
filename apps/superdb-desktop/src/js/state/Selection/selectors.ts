import activeTabSelect from "../Tab/activeTabSelect"

export const get = activeTabSelect((tab) => tab.selection)
export const getValue = activeTabSelect((tab) => tab.selection.value)
export const getField = activeTabSelect((tab) => tab.selection.field)
export const getRootValue = activeTabSelect((tab) => tab.selection.rootValue)
