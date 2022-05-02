export function findTabByUrl(tabs, url) {
  // This may need to get more complicated when we add query versions
  return tabs.find(
    (tab) => global.tabHistories.getOrCreate(tab.id).location.pathname === url
  )
}

export function findTabById(tabs, id) {
  return tabs.find((tab) => tab.id === id)
}
