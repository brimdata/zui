import activeTabSelect from "../Tab/activeTabSelect"

export const get = activeTabSelect((tab) => {
  return tab.queryInfo
})
