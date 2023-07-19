import {grammar} from "ohm-js"
import {BinOp, Symbol, Value} from "./ast"

export const Grammar = grammar(String.raw`
  When {
    Expr = MathOp | Term
    MathOp = Mul | Div | Add | Sub | Eq | Neq | Lt | Lte | Gt | Gte
    Add = Expr "+" Term
    Sub = Expr "-" Term
    Mul = Expr "*" Term
    Div = Expr "/" Term
    Eq = Expr "==" Term
    Neq = Expr "!=" Term
    Gt = Expr ">" Term
    Gte = Expr ">=" Term
    Lt = Expr "<" Term
    Lte = Expr "<=" Term
    Group = "(" Expr ")"

    Term = Group | identifier | Number 
    identifier = letter (letter|digit|".")*
    Number = digit+
  }
`)

export const Semantics = Grammar.createSemantics()

Semantics.addOperation("ast", {
  Add: (a, _, b) => new BinOp("add", a.ast(), b.ast()),
  Sub: (a, _, b) => new BinOp("sub", a.ast(), b.ast()),
  Mul: (a, _, b) => new BinOp("mul", a.ast(), b.ast()),
  Div: (a, _, b) => new BinOp("div", a.ast(), b.ast()),
  Eq: (a, _, b) => new BinOp("eq", a.ast(), b.ast()),
  Neq: (a, _, b) => new BinOp("neq", a.ast(), b.ast()),
  Gt: (a, _, b) => new BinOp("gt", a.ast(), b.ast()),
  Gte: (a, _, b) => new BinOp("gte", a.ast(), b.ast()),
  Lt: (a, _, b) => new BinOp("lt", a.ast(), b.ast()),
  Lte: (a, _, b) => new BinOp("lte", a.ast(), b.ast()),
  Number: (n) => new Value(parseInt(n.sourceString)),
  identifier: function (_a, _b) {
    return new Symbol(this.sourceString)
  },
  Group: (_1, a, _2) => a.ast(),
})
