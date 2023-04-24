import {createOperation} from "../../../core/operations"

export const mainArgsOp = createOperation("mainArgs", ({main}) => {
  return {...main.args}
})
