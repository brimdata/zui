import tabHistory from "src/app/router/tab-history"
import {NewTabSearchParams} from "../electron/ipc/windows/messages"
import Tabs from "../state/Tabs"
import {Store} from "../state/types"
import {featureIsEnabled} from "../../app/core/feature-flag"
import submitSearch from "../../app/query-home/flows/submit-search"

export default function (store: Store, params: NewTabSearchParams) {
  const {href, isNewWin} = params
  if (!isNewWin) {
    store.dispatch(Tabs.create(href))
  } else {
    store.dispatch(tabHistory.replace(href))
  }
  if (featureIsEnabled("query-flow")) store.dispatch(submitSearch())
}
