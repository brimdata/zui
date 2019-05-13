/* @flow */

import {isEqual} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {Node} from "../models/Node"
import {createInvestigationTree} from "../investigation/createTree"
import {deleteFindingByTs, setSearchBarPins} from "../state/actions"
import {fetchMainSearch} from "../viewer/fetchMainSearch"
import {getInvestigation} from "../state/reducers/investigation"
import {getSearchBarPins} from "../state/selectors/searchBar"
import CloseSVG from "../icons/circle-x-md.svg"
import FilterNode from "./FilterNode"

export default function FilterTree() {
  let dispatch = useDispatch()
  let investigation = useSelector(getInvestigation)
  let pinnedFilters = useSelector(getSearchBarPins)

  function onNodeClick(node: Node) {
    dispatch(setSearchBarPins(getPinnedFilters(node)))
    dispatch(fetchMainSearch({saveToHistory: false}))
  }

  function renderNode(node: Node, i: number) {
    let classNames = ["filter-tree-node"]

    if (nodeIsPinned(pinnedFilters, node)) classNames.push("active")

    return (
      <div key={i} className={classNames.join(" ")}>
        <div className="filter-tree-parent" onClick={() => onNodeClick(node)}>
          <FilterNode filter={node.data.filter} />
          <a
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation()
              let multiTs = node.mapChildren((node) => node.data.finding.ts)
              dispatch(deleteFindingByTs(multiTs))
            }}
          >
            <CloseSVG />
          </a>
        </div>
        <div className="filter-tree-children">
          {node.children.map(renderNode)}
        </div>
      </div>
    )
  }

  let tree = createInvestigationTree(investigation)

  return (
    <div className="filter-tree">{tree.getRoot().children.map(renderNode)}</div>
  )
}

export function getPinnedFilters(node: ?Node) {
  const pinnedFilters = []

  while (node) {
    if (node.isRoot()) break
    pinnedFilters.unshift(node.data.filter)
    node = node.parent
  }

  return pinnedFilters
}

export function nodeIsPinned(pinnedFilters: string[], node: ?Node) {
  while (node && !node.isRoot()) {
    const index = node.parentCount() - 1
    const pinned = pinnedFilters[index]

    if (!isEqual(node.data.filter, pinned)) return false

    node = node.parent
  }

  return true
}
