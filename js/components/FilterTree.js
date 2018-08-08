import React from "react"
import Tree from "../models/Tree"
import FilterNode from "./FilterNode"
import isEqual from "lodash/isEqual"

export default class FilterTree extends React.Component {
  constructor(props) {
    super(props)

    this.renderNode = this.renderNode.bind(this)
    this.onNodeClick = this.onNodeClick.bind(this)
  }

  onNodeClick(node) {
    this.props.setSearchBarPins(getPinnedFilters(node))

    setTimeout(this.props.fetch, 150)
  }

  renderNode(node, i) {
    const classNames = ["filter-tree-node"]

    if (nodeIsPinned(this.props.pinnedFilters, node)) classNames.push("active")

    return (
      <div key={i} className={classNames.join(" ")}>
        <FilterNode filter={node.data} onClick={() => this.onNodeClick(node)} />
        {node.children.map(this.renderNode)}
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
