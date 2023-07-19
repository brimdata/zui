import tabHistory from "src/app/router/tab-history"
import Tabs from "../state/Tabs"
import {Store} from "../state/types"
import submitSearch from "../../app/query-home/flows/submit-search"

export default function (store: Store, params: any) {
  const {href, isNewWin} = params
  if (!isNewWin) {
    store.dispatch(Tabs.create(href))
  } else {
    store.dispatch(tabHistory.replace(href))
  }
  store.dispatch(submitSearch())
}
