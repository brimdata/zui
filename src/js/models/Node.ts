import {isEqual} from "lodash"

export type NodeAttrs = {
  data: any
  parent?: Node | null | undefined
  children: any[]
}

export class Node {
  data: any
  parent: Node | null | undefined
  children: Node[]

  constructor({data, parent, children = []}: NodeAttrs) {
    this.data = data
    this.parent = parent
    this.children = children.map(
      ({data, children}) => new Node({data, children, parent: this})
    )
  }

  addChild(data: any) {
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
      children: this.children.map((c) => c.toJSON())
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
    const indexPath = []
    let node = this
    while (node && !node.isRoot()) {
      indexPath.unshift(node.childIndex())
      // @ts-ignore
      node = node.parent
    }
    return indexPath
  }

  mapChildren(func: (arg0: Node) => any) {
    const me = func(this)
    let children = []
    for (const child of this.children) {
      children = [...children, ...child.mapChildren(func)]
    }
    return [me, ...children]
  }
}
