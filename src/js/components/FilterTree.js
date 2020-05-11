/* @flow */

import {includes, isEqual} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import classNames from "classnames"

import {Node} from "../models/Node"
import {RemoveButton} from "./Buttons"
import {createInvestigationTree} from "./FilterTree/helpers"
import {globalDispatch} from "../state/GlobalContext"
import FilterNode from "./FilterNode"
import Investigation from "../state/Investigation"
import SearchBar from "../state/SearchBar"
import submitSearch from "../flows/submitSearch"
import Tab from "../state/Tab"
import Spaces from "../state/Spaces/selectors"
import get from "lodash/get"
import Warning from "./icons/warning-sm.svg"
import ReactTooltip from "react-tooltip"
import Search from "../state/Search"

export default function FilterTree() {
  let dispatch = useDispatch()
  let investigation = useSelector(Investigation.getInvestigation)
  let pinnedFilters = useSelector(SearchBar.getSearchBarPins)
  let previous = useSelector(SearchBar.getSearchBarPreviousInputValue)
  const clusterID = useSelector(Tab.clusterId)
  const spaceIDs = useSelector(Spaces.ids(clusterID))

  function renderNode(node: Node, i: number) {
    function onNodeClick() {
      dispatch(
        SearchBar.restoreSearchBar({
          pinned: getPinnedFilters(node),
          current: node.data.filter,
          previous: node.data.filter,
          error: null,
          editing: null
        })
      )
      const nodeSpace = get(node, ["data", "finding", "search", "space"], "")
      dispatch(Search.setSpace(nodeSpace))
      dispatch(submitSearch(false))
    }

    function onNodeRemove(e) {
      e.stopPropagation()
      let multiTs = node.mapChildren((node) => node.data.finding.ts)
      globalDispatch(Investigation.deleteFindingByTs(multiTs))
    }

    let className = classNames("filter-tree-node", {
      pinned: nodeIsPinned(pinnedFilters, node),
      active: nodeIsActive(pinnedFilters, previous, node)
    })

    function renderWarning() {
      const findingSpaceID = get(
        node,
        ["data", "finding", "search", "spaceID"],
        ""
      )
      const findingSpaceName = get(
        node,
        ["data", "finding", "search", "spaceName"],
        ""
      )

      const tip = `'${findingSpaceName}' space no longer exists`
      if (includes(spaceIDs, findingSpaceID)) return null

      return (
        <div
          className="warning-body"
          data-tip={tip}
          data-effect="solid"
          data-place="right"
        >
          <Warning />
          <ReactTooltip />
        </div>
      )
    }

    return (
      <div key={i} className={className}>
        <div className="filter-tree-parent" onClick={onNodeClick}>
          <FilterNode filter={node.data.filter} />
          {renderWarning()}
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
