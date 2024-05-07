/**
 * @jest-environment jsdom
 */
import {SystemTest} from "src/test/system"
import {parse} from "./operations"
import {ZedAst} from "src/app/core/models/zed-ast"

new SystemTest("editor.parse op")

test("editor.parse", async () => {
  const result = await parse("from source | count() by name")
  expect(result.map((o) => o.kind)).toEqual(["Pool", "Summarize"])
})

test("Zed Ast Pool Name", async () => {
  const result = await parse("from source | count() by name")
  const ast = new ZedAst(result, null)
  expect(ast.poolNames).toEqual(["source"])
})

test("Zed Ast Multi Pool", async () => {
  const result = await parse("from (pool test1 pool test2) | count() by name")
  const ast = new ZedAst(result, null)
  expect(ast.poolNames).toEqual(["test1", "test2"])
})

test("editor.parse error", async () => {
  await expect(parse("from source | ;;;(")).rejects.toHaveProperty(
    "error",
    expect.stringContaining("error parsing Zed at column 15")
  )
})
