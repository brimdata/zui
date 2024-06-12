import {createOperation} from "src/core/operations"
import {lake} from "src/zui"

export const describe = createOperation(
  "editor.describe",
  async (ctx, string, pool?) => {
    try {
      const resp = await lake.client.describeQuery(string, pool)
      return resp.error ? {error: resp} : resp
    } catch (error) {
      return {error: error.toString()}
    }
  }
)
