/* @flow */
import Ast from "./Ast"

test("toJSON", () => {
  const ast = new Ast("path=conn")

  expect(ast.toJSON()).toEqual(expect.any(Object))
})
