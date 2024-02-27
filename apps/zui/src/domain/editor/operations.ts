import {createOperation} from "src/core/operations"
import {lake} from "src/zui"

export const parse = createOperation("editor.parse", async (ctx, string) => {
  const resp = await lake.client.compile(string)
  return resp.toJS()
})
