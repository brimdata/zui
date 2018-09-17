import {LookyTalk} from "boom-js-client"
import isEmpty from "lodash/isEmpty"

export default class Ast {
  constructor(program) {
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

  findNode(finderFunc) {
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
