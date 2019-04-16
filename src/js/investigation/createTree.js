/* @flow */
import {isEqual} from "lodash"

import type {Investigation} from "../reducers/investigation"
import Tree from "../models/Tree"

export function createInvestigationTree(investigation: Investigation) {
  let tree = new Tree({data: "ROOT", children: []})

  for (let finding of investigation) {
    let node = tree.getRoot()

    eachFilter(finding.record, (filter) => {
      if (!node) return
      let nextNode = node.children.find((child) =>
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
