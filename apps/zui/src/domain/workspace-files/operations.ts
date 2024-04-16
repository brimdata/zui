import {createOperation} from "src/core/operations"

export const index = createOperation("workspaceFiles.index", async () => {
  return [{name: "hello world", children: [{name: "my path"}]}]
})
