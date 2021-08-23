import {QueryArgs} from "../types"

export function getDefaultQueryArgs(): QueryArgs {
  return {
    format: "zjson",
    controlMessages: true,
    enhancers: []
  }
}
