import {AstNode, Scope} from "./ast"
import {Grammar, Semantics} from "./parser"

const GLOBAL = new Scope(null, {
  x: 42,
  "results.view": "INSPECTOR",
  "results.rowCount": 500,
})

function assert(input, answer) {
  const match = Grammar.match(input)
  if (match.failed())
    throw new Error("input failed to match " + input + match.message)

  const ast: AstNode = Semantics(match).ast()
  const result = ast.resolve(GLOBAL)
  expect(result.val).toEqual(answer)
}

test("expressions", () => {
  assert("1", 1)
  assert("123", 123)
  assert("(123)", 123)
  assert("(((99)))", 99)
  assert("1 + 1", 2)
  assert("1 - 1", 0)
  assert("3 * 2", 6)
  assert("(10 + 6) / 4", 4)
  assert("5==5", true)
  assert("5==1", false)
  assert("5 != 3", true)
  assert("5 != 5", false)
  assert("5 >= 4", true)
  assert("5 >= 5", true)
  assert("5 >= 6", false)
  assert("5 <= 6", true)
  assert("5 <= 5", true)
  assert("5 <= 4", false)
  assert("5 > 1", true)
  assert("5 > 10", false)
  assert("5 < 10", true)
  assert("5 < 1", false)
  assert("x == 42", true)
  assert("x != 42", false)
  assert("results.view == INSPECTOR", true)
  assert("results.rowCount < 30", false)
})
