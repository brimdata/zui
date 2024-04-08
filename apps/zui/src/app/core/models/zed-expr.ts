import {toFieldPath} from "src/js/zed-script/toZedScript"

export function fieldExprToName(expr) {
  let s = _fieldExprToName(expr)
  // const r = toFieldPath(s)
  return s
}

function _fieldExprToName(expr): string | string[] {
  switch (expr.kind) {
    case "BinaryExpr":
      if (expr.op == ".") {
        return []
          .concat(_fieldExprToName(expr.lhs), _fieldExprToName(expr.rhs))
          .filter((n) => n !== "this")
      }
      return "<not-a-field>"
    case "ID":
      return expr.name
    case "IndexExpr":
      return []
        .concat(_fieldExprToName(expr.expr), _fieldExprToName(expr.index))
        .filter((n) => n !== "this")
    case "This":
      return "this"
    case "Primitive":
      return expr.text
    case "Call":
      var args = expr.args
        .map((e) => toFieldPath(_fieldExprToName(e)))
        .join(",")
      return `${expr.name}(${args})`
    default:
      return "<not-a-field>"
  }
}
