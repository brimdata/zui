import {QueryArgs} from "../types"

export function getDefaultQueryArgs(): QueryArgs {
  return {
    // 5min
    timeout: 300000,
    format: "zjson",
    controlMessages: true,
    enhancers: []
  }
}
