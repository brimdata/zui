import {isEqual} from "lodash"

import {Finding} from "../../state/Investigation/types"
import Tree from "../../models/Tree"

export function createInvestigationTree(investigation: Finding[]) {
  const tree = new Tree({data: "ROOT", children: []})

  for (const finding of investigation) {
    let node = tree.getRoot()

    eachFilter(finding.search, (filter) => {
      if (!node) return
      const nextNode = node.children.find((child) =>
        isEqual(child.data.filter, filter)
      )
      if (nextNode) {
        node = nextNode
      } else {
        node = node.addChild({filter, finding})
      }
    })
  }

  return tree
}

function eachFilter(searchBar, callback) {
  const {pins, program} = searchBar
  const filters = [...pins]

  if (!/^\s*$/.test(program)) filters.push(program)

  return filters.forEach(callback)
}
