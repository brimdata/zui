/* @flow */

import {includes, isEqual} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import ReactTooltip from "react-tooltip"
import classNames from "classnames"
import get from "lodash/get"

import {Node} from "../models/Node"
import {createInvestigationTree} from "./FilterTree/helpers"
import {globalDispatch} from "../state/GlobalContext"
import BookIcon from "../icons/BookSvgIcon"
import Current from "../state/Current"
import EmptySection from "./common/EmptySection"
import FilterNode from "./FilterNode"
import Investigation from "../state/Investigation"
import SearchBar from "../state/SearchBar"
import Spaces from "../state/Spaces/selectors"
import Tab from "../state/Tab"
import Warning from "./icons/warning-sm.svg"
import submitSearch from "../flows/submitSearch"
import usePopupMenu from "./hooks/usePopupMenu"

export default function FilterTree() {
  let dispatch = useDispatch()
  let investigation = useSelector(Investigation.getInvestigation)
  let pinnedFilters = useSelector(SearchBar.getSearchBarPins)
  let previous = useSelector(SearchBar.getSearchBarPreviousInputValue)
  const clusterId = useSelector(Current.getConnectionId)
  const spaceIds = useSelector(Spaces.ids(clusterId))

  function renderNode(node: Node, i: number) {
    const findingSpaceName = get(
      node,
      ["data", "finding", "search", "spaceName"],
      ""
    )

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
      dispatch(Current.setSpaceId(nodeSpaceId))
      dispatch(submitSearch({history: false, investigation: false}))
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

      const tip = "This space no longer exists"
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

    const template = [
      {
        label: "Delete",
        click: () => {
          let multiTs = node.mapChildren((node) => node.data.finding.ts)
          globalDispatch(Investigation.deleteFindingByTs(multiTs))
        }
      },
      {type: "separator"},
      {
        label: "Delete All",
        click: () => globalDispatch(Investigation.clearInvestigation())
      }
    ]

    const openMenu = usePopupMenu(template)
    const onContextMenu = () => {
      openMenu()
    }

    return (
      <div key={i} className={className}>
        <div
          className="filter-tree-parent"
          onClick={onNodeClick}
          onContextMenu={onContextMenu}
          title={findingSpaceName}
        >
          <FilterNode filter={node.data.filter} />
          {renderWarning()}
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
