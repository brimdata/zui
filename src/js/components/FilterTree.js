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
import BookIcon from "../icons/BookSvgIcon"
import EmptySection from "./common/EmptySection"

export default function FilterTree() {
  let dispatch = useDispatch()
  let investigation = useSelector(Investigation.getInvestigation)
  let pinnedFilters = useSelector(SearchBar.getSearchBarPins)
  let previous = useSelector(SearchBar.getSearchBarPreviousInputValue)
  const clusterID = useSelector(Tab.clusterId)
  const spaceIds = useSelector(Spaces.ids(clusterID))

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
      const nodeSpaceId = get(
        node,
        ["data", "finding", "search", "spaceId"],
        ""
      )
      const nodeSpaceName = get(
        node,
        ["data", "finding", "search", "spaceName"],
        ""
      )
      dispatch(Search.setSpace(nodeSpaceId, nodeSpaceName))
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
      const findingSpaceId = get(
        node,
        ["data", "finding", "search", "spaceId"],
        ""
      )
      const findingSpaceName = get(
        node,
        ["data", "finding", "search", "spaceName"],
        ""
      )

      const tip = `'${findingSpaceName}' space no longer exists`
      if (includes(spaceIds, findingSpaceId)) return null

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

  if (tree.getRoot().children.length === 0)
    return (
      <EmptySection
        icon={<BookIcon />}
        message="As you search through your data, your history will appear here."
      />
    )

  console.log("mason: ", !!tree.getRoot().children.length)

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
