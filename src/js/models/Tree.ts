import {Node, NodeAttrs} from "./Node"

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
      for (const index of indexPath) node = node.children[index]
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

  find(data: any) {
    let node = null
    this.bfSearch((n) => {
      if (n && n.data === data) node = n
    })
    return node
  }

  dfSearch(callback: Function) {
    this.recursiveDfSearch(this.root, callback)
  }

  recursiveDfSearch(node: Node | null | undefined, callback: Function) {
    if (node) {
      callback(node)
      node.children.forEach((c) => this.recursiveDfSearch(c, callback))
    }
  }

  bfSearch(callback: Function) {
    const queue = [this.getRoot()]
    while (queue.length != 0) {
      const node = queue.shift()
      if (node) {
        callback(node)
        node.children.forEach((c) => queue.push(c))
      }
    }
  }
}
