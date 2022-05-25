import classNames from "classnames"
import * as remote from "@electron/remote"
import {initial, isEqual, map, tail, take} from "lodash"
import React from "react"
import {useSelector} from "react-redux"
import submitSearch from "src/app/query-home/flows/submit-search"
import BookIcon from "../icons/BookSvgIcon"
import Current from "../state/Current"
import Investigation from "../state/Investigation"
import Search from "../state/Search"
import Url from "../state/Url"
import {SearchRecord} from "../types"
import EmptySection from "./common/EmptySection"
import FilterNode from "./FilterNode"
import {createInvestigationTree, InvestigationNode} from "./FilterTree/helpers"
import usePopupMenu from "./hooks/usePopupMenu"
import {useDispatch} from "src/app/core/state"

const getPins = (node?: InvestigationNode): string[] => {
  const result = map(node?.getPath(), (n) => {
    return n.model.filter
  })

  // don't include root, or final path element as pin
  return tail(initial(result))
}

const nodeIsActivePin = (node: InvestigationNode, prevPins: string[]) => {
  const selected = [...getPins(node), node.model.filter]
  return isEqual(selected, take(prevPins, selected.length))
}

const nodeIsActive = (
  node: InvestigationNode,
  prevPins: string[],
  prevProgram: string
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
    pins: getPins(node),
  }
}

type Props = {
  node: InvestigationNode
  i: number
  lakeId: string
  poolId: string
}

function NodeRow({node, i, lakeId, poolId}: Props) {
  const dispatch = useDispatch()
  const last = useSelector(Url.getSearchParams)
  const prevPins = last.pins
  const prevProgram = last.program
  const menu = usePopupMenu([
    {
      label: "Delete underlying entry",
      click: () => {
        const multiTs = node
          .all(() => true)
          .map((node) => node.model.finding.ts)
        dispatch(Investigation.deleteFindingByTs(lakeId, poolId, multiTs))
      },
    },
    {type: "separator"},
    {
      label: "Delete All",
      click: () =>
        remote.dialog
          .showMessageBox({
            type: "warning",
            title: "Delete All History",
            message: `Are you sure you want to delete all history entries for this pool?`,
            buttons: ["OK", "Cancel"],
          })
          .then(({response}) => {
            if (response === 0)
              dispatch(Investigation.clearPoolInvestigation(lakeId, poolId))
          }),
    },
  ])

  function onNodeClick() {
    dispatch(Search.restore(reconstructSearch(node)))
    dispatch(submitSearch({history: true, investigation: false}))
  }

  const className = classNames("filter-tree-node", {
    pinned: nodeIsActivePin(node, prevPins),
    active: nodeIsActive(node, prevPins, prevProgram),
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
          <NodeRow node={node} lakeId={lakeId} poolId={poolId} i={i} key={i} />
        ))}
      </div>
    </div>
  )
}

export default function FilterTree() {
  const currentLakeId = useSelector(Current.getLakeId)
  const currentPoolId = useSelector(Current.getPoolId)
  const investigation = useSelector(Investigation.getCurrentHistory)
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
          lakeId={currentLakeId}
          poolId={currentPoolId}
          node={node}
          i={i}
          key={i}
        />
      ))}
    </div>
  )
}
