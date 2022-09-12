import {createCommand} from "./command"
import submitSearch from "src/app/query-home/flows/submit-search"

export const runQuery = createCommand("submitSearch", ({dispatch}) => {
  dispatch(submitSearch())
})
