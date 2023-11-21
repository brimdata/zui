export function find(data, id) {
  if (!data) return

  for (let item of data) {
    if (item.id === id) return item
    const found = find(item.children, id)
    if (found) return found
  }
}

export function getDecendents(data) {
  let nodes = [data]
  for (let item of data.children || []) {
    nodes = nodes.concat(getDecendents(item))
  }
  return nodes
}

export function getDecendentIds(data) {
  return getDecendents(data).map((d) => d.id)
}
