function getParent(node: Element) {
  return node.parentNode instanceof Element ? node.parentNode : null
}

export function findAncestor(node: Element, match: (n: Element) => boolean) {
  while (node && !match(node)) node = getParent(node)
  return node
}
