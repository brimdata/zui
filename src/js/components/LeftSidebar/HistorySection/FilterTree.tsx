import classNames from "classnames"
import * as remote from "@electron/remote"
import {initial, isEqual, map, tail, take} from "lodash"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {submitSearch} from "src/js/flows/submitSearch/mod"
import Current from "src/js/state/Current"
import Investigation from "src/js/state/Investigation"
import Search from "src/js/state/Search"
import Url from "src/js/state/Url"
import {SearchRecord} from "src/js/types"
import FilterNode from "./FilterNode"
import {createInvestigationTree, InvestigationNode} from "./helpers"
import usePopupMenu from "src/js/components/hooks/usePopupMenu"

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
    pins: getPins(node)
  }
}

type Props = {
  node: InvestigationNode
  i: number
  workspaceId: string
  poolId: string
}

function NodeRow({node, i, workspaceId, poolId}: Props) {
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
        dispatch(Investigation.deleteFindingByTs(workspaceId, poolId, multiTs))
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
            message: `Are you sure you want to delete all history entries for this pool?`,
            buttons: ["OK", "Cancel"]
          })
          .then(({response}) => {
            if (response === 0)
              dispatch(
                Investigation.clearPoolInvestigation(workspaceId, poolId)
              )
          })
    }
  ])

  function onNodeClick() {
    dispatch(Search.restore(reconstructSearch(node)))
    dispatch(submitSearch({history: true, investigation: false}))
  }

  const className = classNames("filter-tree-node", {
    pinned: nodeIsActivePin(node, prevPins),
    active: nodeIsActive(node, prevPins, prevProgram)
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
            workspaceId={workspaceId}
            poolId={poolId}
            i={i}
            key={i}
          />
        ))}
      </div>
    </div>
  )
}

export default function FilterTree() {
  const currentWorkspaceId = useSelector(Current.getWorkspaceId)
  const currentPoolId = useSelector(Current.getPoolId)
  const investigation = useSelector(Investigation.getCurrentHistory)
  const tree = createInvestigationTree(investigation)

  return (
    <div className="filter-tree">
      {tree.children.map((node, i) => (
        <NodeRow
          workspaceId={currentWorkspaceId}
          poolId={currentPoolId}
          node={node}
          i={i}
          key={i}
        />
      ))}
    </div>
  )
}
