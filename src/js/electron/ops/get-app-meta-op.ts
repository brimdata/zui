import {createOperation} from "../../../core/operations"

export const getAppMetaOp = createOperation("getAppMeta", ({main}) => {
  return main.appMeta
})
