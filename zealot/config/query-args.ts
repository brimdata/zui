import {QueryArgs} from "../types"

export function getDefaultQueryArgs(): QueryArgs {
  return {
    timeout: 30000,
    format: "zjson",
    controlMessages: true,
    enhancers: []
  }
}
