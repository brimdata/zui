/* @flow */

import React from "react"
import Tree, {Node} from "../models/Tree"
import FilterNode from "./FilterNode"
import isEqual from "lodash/isEqual"
import CloseSVG from "../icons/circle-x-md.svg"
import {connect} from "react-redux"
import {getSearchBarPins} from "../selectors/searchBar"
import {getFilterTree} from "../reducers/filterTree"
import type {State} from "../reducers/types"
import type {Dispatch} from "../reducers/types"
import {setSearchBarPins} from "../actions/searchBar"
import {fetchMainSearch} from "../actions/mainSearch"
import {removeFilterTreeNode} from "../actions/filterTree"
import type {FilterTree as FilterTreeType} from "../reducers/filterTree"

type OwnProps = {||}

type DispatchProps = {|
  dispatch: Dispatch
|}

type StateProps = {|
  filterTree: FilterTreeType,
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

    setTimeout(
      () => this.props.dispatch(fetchMainSearch({saveToHistory: false})),
      150
    )
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
          <FilterNode filter={node.data} />
          <a
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation()
              this.props.dispatch(removeFilterTreeNode(node))
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
    const {children, data} = this.props.filterTree
    const tree = new Tree({children, data, parent: null})
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
    pinnedFilters.unshift(node.data)
    node = node.parent
  }

  return pinnedFilters
}

export function nodeIsPinned(pinnedFilters: string[], node: ?Node) {
  while (node && !node.isRoot()) {
    const index = node.parentCount() - 1
    const pinned = pinnedFilters[index]

    if (!isEqual(node.data, pinned)) return false

    node = node.parent
  }

  return true
}

function stateToProps(state: State) {
  return {
    filterTree: getFilterTree(state),
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
