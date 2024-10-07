export function findTabByUrl(tabs, url) {
  return tabs.find((tab) => {
    return global.tabHistories.getOrCreate(tab.id).location.pathname === url
  })
}

export function findTabById(tabs, id) {
  return tabs.find((tab) => tab.id === id)
}
