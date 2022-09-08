import {createOperation} from "../operations"

export const getAppMetaOp = createOperation("getAppMeta", ({main}) => {
  return main.appMeta
})
