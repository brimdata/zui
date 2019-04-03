/* @flow */

import isEqual from "lodash/isEqual"

export type NodeAttrs = {
  data: *,
  parent?: Object,
  children: Object[]
}

export default class Tree {
  root: Node

  constructor(nodeData: NodeAttrs) {
    this.root = new Node(nodeData)
  }

  getRoot() {
    return this.root
  }

  isEmpty() {
    return this.getRoot() === null
  }

  toJSON() {
    return this.root.toJSON()
  }

  getNodeAt(indexPath: number[]) {
    let node = this.getRoot()
    if (node) {
      for (var index of indexPath) node = node.children[index]
    }
    return node
  }

  contains(node: Node) {
    while (node.parent) {
      node = node.parent
    }
    return node === this.root
  }

  remove(node: Node) {
    if (!this.contains(node)) return

    if (node.isRoot()) {
      throw new Error("Not able to remove the root node")
    } else {
      if (node.parent) {
        node.parent.children.splice(node.childIndex(), 1)
      }
      node.parent = null
    }
  }

  find(data: *) {
    let node = null
    this.bfSearch(n => {
      if (n && n.data === data) node = n
    })
    return node
  }

  dfSearch(callback: Function) {
    this.recursiveDfSearch(this.root, callback)
  }

  dfArray() {
    if (this.isEmpty()) return []

    let array = []
    this.dfSearch(node => array.push(node))
    return array
  }

  recursiveDfSearch(node: ?Node, callback: Function) {
    if (node) {
      callback(node)
      node.children.forEach(c => this.recursiveDfSearch(c, callback))
    }
  }

  bfSearch(callback: Function) {
    let queue = [this.getRoot()]
    while (queue.length != 0) {
      let node = queue.shift()
      if (node) {
        callback(node)
        node.children.forEach(c => queue.push(c))
      }
    }
  }

  bfArray() {
    if (this.isEmpty()) return []

    let array = []
    this.bfSearch(node => array.push(node))
    return array
  }
}

export class Node {
  data: *
  parent: ?Node
  children: Node[]

  constructor({data, parent, children = []}: NodeAttrs) {
    this.data = data
    this.parent = parent
    this.children = children.map(
      ({data, children}) => new Node({data, children, parent: this})
    )
  }

  addChild(data: *) {
    const child = new Node({
      data,
      parent: this,
      children: []
    })

    this.children.push(child)

    return child
  }

  parentCount() {
    let count = 0
    let parent = this.parent

    while (parent != null) {
      count += 1
      parent = parent.parent
    }

    return count
  }

  toJSON(): Object {
    return {
      data: this.data,
      children: this.children.map(c => c.toJSON())
    }
  }

  isInPath(indexPath: number[]) {
    const ownPath = this.getIndexPath()
    if (ownPath.length > indexPath.length) return false
    if (indexPath.length === 0) return false

    return isEqual(indexPath.slice(0, ownPath.length), ownPath)
  }

  isRoot() {
    return !this.parent
  }

  childIndex() {
    if (this.parent) {
      return this.parent.children.indexOf(this)
    } else {
      return -1
    }
  }

  isLastChild() {
    const {parent} = this
    if (parent) {
      return this.childIndex() === parent.children.length - 1
    } else {
      return true
    }
  }

  getIndexPath() {
    let indexPath = []
    let node = this
    while (node && !node.isRoot()) {
      indexPath.unshift(node.childIndex())
      node = node.parent
    }
    return indexPath
  }
}
