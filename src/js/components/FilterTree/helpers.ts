import {isEqual} from "lodash"

import {Finding} from "../../state/Investigation/types"
import TreeModel from "tree-model"

export type InvestigationNode = TreeModel.Node<{
  // filter can be a pin or program
  filter: string
  finding: Finding
}>

export function createInvestigationTree(
  investigation: Finding[]
): InvestigationNode {
  const tree = new TreeModel().parse({filter: "ROOT", finding: null})

  for (const finding of investigation) {
    let node = tree

    eachFilter(finding.search, (filter) => {
      if (!node) return
      const nextNode = node.children.find((child) =>
        isEqual(child.model.filter, filter)
      )
      if (nextNode) {
        node = nextNode
      } else {
        node = node.addChild(new TreeModel().parse({filter, finding}))
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
