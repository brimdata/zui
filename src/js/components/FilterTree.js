/* @flow */

import {isEqual} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import classNames from "classnames"

import {Node} from "../models/Node"
import {RemoveButton} from "./Buttons"
import {createInvestigationTree} from "../investigation/createTree"
import {deleteFindingByTs, restoreSearchBar} from "../state/actions"
import {fetchMainSearch} from "../viewer/fetchMainSearch"
import {getInvestigation} from "../state/reducers/investigation"
import {
  getSearchBarPins,
  getSearchBarPreviousInputValue
} from "../state/selectors/searchBar"
import FilterNode from "./FilterNode"

export default function FilterTree() {
  let dispatch = useDispatch()
  let investigation = useSelector(getInvestigation)
  let pinnedFilters = useSelector(getSearchBarPins)
  let previous = useSelector(getSearchBarPreviousInputValue)

  function renderNode(node: Node, i: number) {
    function onNodeClick() {
      dispatch(
        restoreSearchBar({
          pinned: getPinnedFilters(node),
          current: node.data.filter,
          previous: node.data.filter,
          error: null,
          editing: null
        })
      )
      dispatch(fetchMainSearch({saveToHistory: false}))
    }

    function onNodeRemove(e) {
      e.stopPropagation()
      let multiTs = node.mapChildren((node) => node.data.finding.ts)
      dispatch(deleteFindingByTs(multiTs))
    }

    let className = classNames("filter-tree-node", {
      pinned: nodeIsPinned(pinnedFilters, node),
      active: nodeIsActive(pinnedFilters, previous, node)
    })

    return (
      <div key={i} className={className}>
        <div className="filter-tree-parent" onClick={onNodeClick}>
          <FilterNode filter={node.data.filter} />
          <RemoveButton
            className="gutter-button-style"
            onClick={onNodeRemove}
          />
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
  let pinnedFilters = []

  node = node && node.parent
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

function nodeIsActive(pinnedFilters: string[], previous: string, node: ?Node) {
  return (
    node &&
    node.data.filter === previous &&
    isEqual(pinnedFilters, getPinnedFilters(node))
  )
}
