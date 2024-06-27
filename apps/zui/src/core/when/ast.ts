export interface AstNode {
  resolve(scope: Scope): Value
}

export class Scope {
  storage = new Map<string, any>()

  constructor(parent: Scope | null, initialValues = {}) {
    for (let [key, value] of Object.entries(initialValues)) {
      this.set(new Symbol(key), new Value(value))
    }
  }

  set(sym: Symbol, value: Value) {
    this.storage.set(sym.name, value)
  }

  get(sym: Symbol) {
    if (!this.storage.has(sym.name)) {
      throw new Error(`Could not find symbol '${sym.name}'`)
    }
    return this.storage.get(sym.name)
  }

  has(sym: Symbol) {
    return this.storage.has(sym.name)
  }
}

export class Value {
  constructor(public val: any) {}

  resolve(_scope: Scope) {
    return this
  }
  jsEquals(jsVal) {
    return this.val === jsVal
  }
}

export class Symbol {
  constructor(public name: string) {}

  resolve(scope: Scope) {
    return scope.get(this)
  }
}

type BinOpName =
  | "add"
  | "sub"
  | "mul"
  | "div"
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"

export class BinOp {
  constructor(public op: BinOpName, public a: AstNode, public b: AstNode) {}

  resolveLeft(scope: Scope) {
    return this.a.resolve(scope)
  }

  resolveRight(scope: Scope) {
    if (this.b instanceof Symbol) {
      if (scope.has(this.b)) return scope.get(this.b)
      else return new Value(this.b.name)
    } else {
      return this.b.resolve(scope)
    }
  }

  resolve(scope: Scope): Value {
    const a = this.resolveLeft(scope).val
    const b = this.resolveRight(scope).val

    if (this.op === "add") return new Value(a + b)
    if (this.op === "sub") return new Value(a - b)
    if (this.op === "mul") return new Value(a * b)
    if (this.op === "div") return new Value(a / b)
    if (this.op === "eq") return new Value(a == b)
    if (this.op === "neq") return new Value(a != b)
    if (this.op === "gte") return new Value(a >= b)
    if (this.op === "lte") return new Value(a <= b)
    if (this.op === "gt") return new Value(a > b)
    if (this.op === "lt") return new Value(a < b)
    throw new Error("Missing: " + this.op)
  }
}
