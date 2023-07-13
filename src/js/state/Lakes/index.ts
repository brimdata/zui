import {reducer, actions} from "./reducer"
import selectors from "./selectors"
import {Lake} from "./types"

const getDefaultLake = (port: string, user: string): Lake => {
  return {
    host: "http://localhost",
    port,
    id: `localhost:${port}`,
    name: `${user}'s Zed Lake`,
    authType: "none",
  }
}

export default {
  ...actions,
  ...selectors,
  getDefaultLake,
  reducer,
}
