import {createOperation} from "src/core/operations"

export const parse = createOperation("editor.parse", async (ctx, string) => {
  const client = await ctx.main.createDefaultClient()
  const resp = await client.compile(string)
  return resp.toJS()
})
