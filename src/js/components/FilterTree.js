/* @flow */

import {connect} from "react-redux"
import {isEqual} from "lodash"
import React from "react"

import type {Dispatch, State} from "../state/types"
import {
  type Investigation,
  getInvestigation
} from "../state/reducers/investigation"
import {Node} from "../models/Node"
import {createInvestigationTree} from "../investigation/createTree"
import {deleteFindingByTs, setSearchBarPins} from "../state/actions"
import {fetchMainSearch} from "../viewer/fetchMainSearch"
import {getSearchBarPins} from "../state/selectors/searchBar"
import CloseSVG from "../icons/circle-x-md.svg"
import FilterNode from "./FilterNode"

type OwnProps = {||}

type DispatchProps = {|
  dispatch: Dispatch
|}

type StateProps = {|
  investigation: Investigation,
  pinnedFilters: string[]
|}

type AllProps = {
  ...DispatchProps,
  ...OwnProps,
  ...StateProps
}

export default class FilterTree extends React.Component<AllProps> {
  onNodeClick = (node: Node) => {
    this.props.dispatch(setSearchBarPins(getPinnedFilters(node)))
    this.props.dispatch(fetchMainSearch({saveToHistory: false}))
  }

  renderNode = (node: Node, i: number) => {
    const classNames = ["filter-tree-node"]

    if (nodeIsPinned(this.props.pinnedFilters, node)) classNames.push("active")

    return (
      <div key={i} className={classNames.join(" ")}>
        <div
          className="filter-tree-parent"
          onClick={() => this.onNodeClick(node)}
        >
          <FilterNode filter={node.data.filter} />
          <a
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation()
              let multiTs = node.mapChildren((node) => node.data.finding.ts)
              this.props.dispatch(deleteFindingByTs(multiTs))
            }}
          >
            <CloseSVG />
          </a>
        </div>
        <div className="filter-tree-children">
          {node.children.map(this.renderNode)}
        </div>
      </div>
    )
  }

  render() {
    let tree = createInvestigationTree(this.props.investigation)

    return (
      <div className="filter-tree">
        {tree.getRoot().children.map(this.renderNode)}
      </div>
    )
  }
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

function stateToProps(state: State) {
  return {
    investigation: getInvestigation(state),
    pinnedFilters: getSearchBarPins(state)
  }
}

const dispatchToProps = (dispatch: Dispatch) => ({
  dispatch
})

export const XFilterTree = connect<AllProps, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(FilterTree)
