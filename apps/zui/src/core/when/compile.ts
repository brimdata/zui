import {AstNode, Scope} from "./ast"
import {Grammar, Semantics} from "./parser"

export function compile(
  input: string | undefined = undefined,
  context: Record<string, any>
): boolean {
  if (!input) return true
  const match = Grammar.match(input)
  if (match.failed()) {
    throw new Error(
      "Syntax error in when clause '" + input + "' " + match.message
    )
  }
  const ast: AstNode = Semantics(match).ast()
  const scope = new Scope(null, context)
  const result = ast.resolve(scope).val
  if (typeof result !== "boolean") {
    throw new Error("When clause must return a boolean")
  }
  return result
}
