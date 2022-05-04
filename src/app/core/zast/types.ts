export type SequentialOp = {
  kind: "Sequential"
  ops: ZedOp[]
}

export type OpExpr = {
  kind: "OpExpr"
  expr: ZedExpr
}

export type BinaryExpr = {
  kind: "BinaryExpr"
  op: "=="
  lhs: ZedExpr
  rhs: ZedExpr
}

export type Id = {
  kind: "ID"
  name: string
}

export type Primitive = {
  kind: "Primitive"
  type: string
  text: string
}

export type SummarizeOp = {
  kind: "Summarize"
  keys: AssignmentOp[]
  aggs: AssignmentOp[]
  limit: number
}

export type AssignmentOp = {
  kind: "Assignment"
  lhs: unknown
  rhs: unknown
}

export type SortOp = {
  kind: "Sort"
  args: ZedExpr[]
  order: "desc" | "asc"
  nullsfirst: boolean
}

export type ZedOp = SequentialOp | OpExpr | SummarizeOp | SortOp | ZedExpr
export type ZedExpr = BinaryExpr | Id | Primitive
