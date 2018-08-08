import isEqual from "lodash/isEqual"

export default class Tree {
  constructor(nodeData) {
    this.root = nodeData ? new Node(nodeData) : null
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

  getNodeAt(indexPath) {
    let node = this.getRoot()
    for (var index of indexPath) {
      node = node.children[index]
    }
    return node
  }

  find(data) {
    let node = null
    this.bfSearch(n => {
      if (n.data === data) node = n
    })
    return node
  }

  dfSearch(callback) {
    this.recursiveDfSearch(this.root, callback)
  }

  dfArray() {
    if (this.isEmpty()) return []

    let array = []
    this.dfSearch(node => array.push(node))
    return array
  }

  recursiveDfSearch(node, callback) {
    callback(node)
    node.children.forEach(c => this.recursiveDfSearch(c, callback))
  }

  bfSearch(callback) {
    let queue = [this.getRoot()]
    while (queue.length != 0) {
      let node = queue.shift()
      callback(node)
      node.children.forEach(c => queue.push(c))
    }
  }

  bfArray() {
    if (this.isEmpty()) return []

    let array = []
    this.bfSearch(node => array.push(node))
    return array
  }
}

class Node {
  constructor({data, parent = null, children = []}) {
    this.data = data
    this.parent = parent
    this.children = children.map(child => new Node({...child, parent: this}))
  }

  addChild(data) {
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

  toJSON() {
    return {
      data: this.data,
      children: this.children.map(c => c.toJSON())
    }
  }

  isInPath(indexPath) {
    const ownPath = this.getIndexPath()
    if (ownPath.length > indexPath.length) return false
    if (indexPath.length === 0) return false

    return isEqual(indexPath.slice(0, ownPath.length), ownPath)
  }

  isRoot() {
    return !this.parent
  }

  siblingIndex() {
    if (this.isRoot()) return null

    return this.parent.children.indexOf(this)
  }

  isLastChild() {
    if (this.isRoot()) return true

    return this.siblingIndex() === this.parent.children.length - 1
  }

  getIndexPath() {
    let indexPath = []
    let node = this
    while (!node.isRoot()) {
      indexPath.unshift(node.siblingIndex())
      node = node.parent
    }
    return indexPath
  }
}
