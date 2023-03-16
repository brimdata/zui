import {zed} from "@brimdata/zealot"
import {ResultsState, ResultsStatus} from "./types"

export const initialResultData = () => ({
  values: [] as zed.Value[],
  shapes: {} as {[id: string]: zed.Type},
  status: "INIT" as ResultsStatus,
  page: 1,
  perPage: 500,
  aggregationLimit: 2000,
  aggregation: false,
  key: "",
  query: "*",
  error: null as null | any,
})

export function access(state: ResultsState, id: string) {
  if (state[id]) return state[id]
  else return (state[id] = initialResultData())
}
