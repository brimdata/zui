import {ZedAst} from "./zed-ast"

export class ZedScript {
  constructor(public script: string) {}

  private _ast: ZedAst
  get ast() {
    return this._ast || (this._ast = new ZedAst(this.script))
  }

  get range() {
    const pool = this.ast.pools[0]
    if (!pool) return null
    const range = pool.range
    if (!range) return null

    return [parseRangeItem(range.lower), parseRangeItem(range.upper)]
  }
}

function parseRangeItem({type, text}) {
  switch (type) {
    case "int64":
      return parseInt(text)
    case "time":
      return new Date(text)
  }
}
