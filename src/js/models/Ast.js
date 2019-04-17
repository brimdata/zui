/* @flow */

import LookyTalk from "lookytalk"
import isEmpty from "lodash/isEmpty"

export default class Ast {
  program: string
  tree: ?Object

  constructor(program: string) {
    this.program = program
    try {
      this.tree = LookyTalk.parse(isEmpty(program) ? "*" : program)
    } catch (e) {
      this.tree = null
    }
  }

  toJSON() {
    return this.tree
  }

  findNode(finderFunc: Function) {
    if (!this.tree) return null

    let stack = [this.tree.search]
    let node
    while (stack.length > 0) {
      node = stack.shift()
      if (finderFunc(node)) return node
      if (node.left) stack.unshift(node.left)
      if (node.right) stack.unshift(node.right)
    }
    return null
  }
}
