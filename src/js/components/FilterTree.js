import React from "react"
import Tree from "../models/Tree"
import FilterNode from "./FilterNode"
import isEqual from "lodash/isEqual"
import CloseSVG from "../icons/circle-x-md.svg"

export default class FilterTree extends React.Component {
  constructor(props) {
    super(props)

    this.renderNode = this.renderNode.bind(this)
    this.onNodeClick = this.onNodeClick.bind(this)
  }

  onNodeClick(node) {
    this.props.setSearchBarPins(getPinnedFilters(node))

    setTimeout(this.props.fetchMainSearch({saveToHistory: false}), 150)
  }

  renderNode(node, i) {
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
            className="close-button"
            onClick={e => {
              e.stopPropagation()
              this.props.removeFilterTreeNode(node)
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
    const tree = new Tree(this.props.filterTree)
    return (
      <div className="filter-tree">
        {tree.getRoot().children.map(this.renderNode)}
      </div>
    )
  }
}

export function getPinnedFilters(node) {
  const pinnedFilters = []

  while (node) {
    if (node.isRoot()) break
    pinnedFilters.unshift(node.data)
    node = node.parent
  }

  return pinnedFilters
}

export function nodeIsPinned(pinnedFilters, node) {
  while (!node.isRoot()) {
    const index = node.parentCount() - 1
    const pinned = pinnedFilters[index]

    if (!isEqual(node.data, pinned)) return false

    node = node.parent
  }

  return true
}
