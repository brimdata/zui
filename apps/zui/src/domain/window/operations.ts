import {createOperation} from "src/core/operations"
import {window} from "src/zui"

export const sync = createOperation("window.sync", (ctx, props) => {
  console.log("window sync", props)
  window.lakeId = props.lakeId
})
