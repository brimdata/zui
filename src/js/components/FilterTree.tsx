import {isEqual} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import classNames from "classnames"

import {Node} from "../models/Node"
import {createInvestigationTree} from "./FilterTree/helpers"
import {globalDispatch} from "../state/GlobalContext"
import {submitSearch} from "../flows/submitSearch/mod"
import BookIcon from "../icons/BookSvgIcon"
import Current from "../state/Current"
import EmptySection from "./common/EmptySection"
import FilterNode from "./FilterNode"
import Investigation from "../state/Investigation"
import Search from "../state/Search"
import usePopupMenu from "./hooks/usePopupMenu"
import {remote} from "electron"
import Last from "../state/Last"

type Props = {node: any; i: number; connId: string; spaceId: string}

function NodeRow({node, i, connId, spaceId}: Props) {
  const dispatch = useDispatch()
  const last = useSelector(Last.getSearch)
  const pinnedFilters = last?.pins || []
  const previous = last?.program || ""
  const menu = usePopupMenu([
    {
      label: "Delete",
      click: () => {
        const multiTs = node.mapChildren((node) => node.data.finding.ts)
        globalDispatch(
          Investigation.deleteFindingByTs(connId, spaceId, multiTs)
        )
      }
    },
    {type: "separator"},
    {
      label: "Delete All",
      click: () =>
        remote.dialog
          .showMessageBox({
            type: "warning",
            title: "Delete All History",
            message: `Are you sure you want to delete all history entries for this space?`,
            buttons: ["OK", "Cancel"]
          })
          .then(({response}) => {
            if (response === 0)
              globalDispatch(
                Investigation.clearSpaceInvestigation(connId, spaceId)
              )
          })
    }
  ])

  function onNodeClick() {
    dispatch(Search.restore(node.data.finding.search))
    dispatch(submitSearch({history: true, investigation: false}))
  }

  const className = classNames("filter-tree-node", {
    pinned: nodeIsPinned(pinnedFilters, node),
    active: nodeIsActive(pinnedFilters, previous, node)
  })

  return (
    <div key={i} className={className}>
      <div
        className="filter-tree-parent"
        onClick={onNodeClick}
        onContextMenu={() => menu.open()}
      >
        <FilterNode filter={node.data.filter} />
      </div>
      <div className="filter-tree-children">
        {node.children.map((node, i) => (
          <NodeRow
            node={node}
            connId={connId}
            spaceId={spaceId}
            i={i}
            key={i}
          />
        ))}
      </div>
    </div>
  )
}

export default function FilterTree() {
  const currentConnId = useSelector(Current.getConnectionId)
  const currentSpaceId = useSelector(Current.getSpaceId)
  const investigation = useSelector(
    Investigation.getInvestigation(currentConnId, currentSpaceId)
  )
  const tree = createInvestigationTree(investigation)

  if (tree.getRoot().children.length === 0)
    return (
      <EmptySection
        icon={<BookIcon />}
        message="As you search through your data, your history will appear here."
      />
    )

  return (
    <div className="filter-tree">
      {tree.getRoot().children.map((node, i) => (
        <NodeRow
          connId={currentConnId}
          spaceId={currentSpaceId}
          node={node}
          i={i}
          key={i}
        />
      ))}
    </div>
  )
}

export function getPinnedFilters(node: Node | null | undefined) {
  const pinnedFilters = []

  node = node && node.parent
  while (node) {
    if (node.isRoot()) break
    pinnedFilters.unshift(node.data.filter)
    node = node.parent
  }

  return pinnedFilters
}

export function nodeIsPinned(
  pinnedFilters: string[],
  node: Node | null | undefined
) {
  while (node && !node.isRoot()) {
    const index = node.parentCount() - 1
    const pinned = pinnedFilters[index]

    if (!isEqual(node.data.filter, pinned)) return false

    node = node.parent
  }

  return true
}

function nodeIsActive(
  pinnedFilters: string[],
  previous: string,
  node: Node | null | undefined
) {
  return (
    node &&
    node.data.filter === previous &&
    isEqual(pinnedFilters, getPinnedFilters(node))
  )
}
