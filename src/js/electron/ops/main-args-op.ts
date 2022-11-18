import {createOperation} from "../operations"

export const mainArgsOp = createOperation("mainArgs", ({main}) => {
  return {...main.args}
})
