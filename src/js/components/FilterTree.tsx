import {isEqual, reduce, initial, tail} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import classNames from "classnames"

import {createInvestigationTree, InvestigationNode} from "./FilterTree/helpers"
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
import {SearchRecord} from "../types"

const getPins = (node?: InvestigationNode): string[] => {
  const result = reduce(
    node?.getPath(),
    (res, n) => {
      res.push(n.model.filter)
      return res
    },
    []
  )

  // don't include root, or final path element as pin
  return tail(initial(result))
}

const nodeIsPin = (node: InvestigationNode) => {
  return node.hasChildren()
}

const nodeIsActive = (
  prevPins: string[],
  prevProgram: string,
  node?: InvestigationNode
) => {
  return (
    node &&
    node.model.filter === prevProgram &&
    isEqual(prevPins, getPins(node))
  )
}

const reconstructSearch = (node: InvestigationNode): SearchRecord => {
  return {
    ...node.model.finding.search,
    program: node.model.filter,
    pins: getPins(node)
  }
}

type Props = {
  node: InvestigationNode
  i: number
  connId: string
  spaceId: string
}

function NodeRow({node, i, connId, spaceId}: Props) {
  const dispatch = useDispatch()
  const last = useSelector(Last.getSearch)
  const prevPins = last?.pins || []
  const prevProgram = last?.program || ""
  const menu = usePopupMenu([
    {
      label: "Delete",
      click: () => {
        remote.dialog
          .showMessageBox({
            type: "warning",
            title: "Delete History Entry",
            message: `Are you sure you want to remove this entry and it's underlying query?`,
            buttons: ["OK", "Cancel"]
          })
          .then(({response}) => {
            if (response === 0) {
              const multiTs = node
                .all(() => true)
                .map((node) => node.model.finding.ts)
              globalDispatch(
                Investigation.deleteFindingByTs(connId, spaceId, multiTs)
              )
            }
          })
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
    dispatch(Search.restore(reconstructSearch(node)))
    dispatch(submitSearch({history: true, investigation: false}))
  }

  const className = classNames("filter-tree-node", {
    pinned: nodeIsPin(node),
    active: nodeIsActive(prevPins, prevProgram, node)
  })

  return (
    <div key={i} className={className}>
      <div
        className="filter-tree-parent"
        onClick={onNodeClick}
        onContextMenu={() => menu.open()}
      >
        <FilterNode filter={node.model.filter} />
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

  if (tree.children.length === 0)
    return (
      <EmptySection
        icon={<BookIcon />}
        message="As you search through your data, your history will appear here."
      />
    )

  return (
    <div className="filter-tree">
      {tree.children.map((node, i) => (
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
