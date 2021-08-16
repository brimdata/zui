import {QueryArgs} from "../types"

export function getDefaultQueryArgs(): QueryArgs {
  return {
    // from: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days
    // to: new Date(),
    format: "zjson",
    controlMessages: true,
    enhancers: []
  }
}
