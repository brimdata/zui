import {ZedAst} from "./zed-ast"

export class ZedScript {
  constructor(public script: string) {}

  private _ast: ZedAst
  get ast() {
    return this._ast || (this._ast = new ZedAst(this.script))
  }

  isEmpty() {
    const lines = this.script.split("\n")
    const comment = /^\s*\/\/.*$/
    const whiteSpace = /^\s*$/
    const linesWithZed = lines.filter(
      (line) => !comment.test(line) && !whiteSpace.test(line)
    )
    return linesWithZed.length === 0
  }
}
