import {ZedAst} from "./zed-ast"

export class ZedScript {
  constructor(public script: string) {}

  private _ast: ZedAst
  get ast() {
    return this._ast || (this._ast = new ZedAst(this.script))
  }
}
