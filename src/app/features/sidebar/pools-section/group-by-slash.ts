import {last} from "lodash"
import {NodeApi} from "react-arborist"
import {Pool} from "src/app/core/pools/pool"

export function groupBySlash(data: Pool[]) {
  const tree = []
  for (let item of data) {
    let siblings = tree
    item.name.split("/").forEach((namePart, index, array) => {
      const isLast = index === array.length - 1
      const name = namePart.trim()
      const prefix = array.slice(0, index + 1).join("/")
      const treeItem = isLast ? item : {name, prefix, id: prefix}
      const node = findOrPush(siblings, treeItem)
      if (!isLast) {
        if (!("children" in node)) node.children = []
        siblings = node.children
      }
    })
  }
  return tree
}

function findOrPush(array: any[], item: any) {
  const found = array.find((i) => i.name == item.name)
  if (found) return found
  array.push(item)
  return item
}

export function lastPart(name: string) {
  return last(name.split("/")).trim()
}

export function getDecendentLeaves(node: NodeApi<Pool>) {
  let list = []

  function recurse(node: NodeApi<Pool>) {
    if (node.isLeaf) {
      list.push(node)
    } else {
      node.children.forEach(recurse)
    }
  }
  recurse(node)
  return list
}
