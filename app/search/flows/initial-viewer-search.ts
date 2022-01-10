import brim from "src/js/brim"
import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "src/js/flows/config"
import {addHeadProc} from "src/js/lib/Program"
import Url from "src/js/state/Url"
import Viewer from "src/js/state/Viewer"
import Tabs from "../../../src/js/state/Tabs"
import {viewerSearch} from "./viewer-search"
import {Thunk} from "src/js/state/types"
import {SearchResult} from "src/js/flows/search/mod"

/**
 * Initial search to fill the viewer, as opposed to the "next-page"
 * search which allows for the inifinite scroll behavior.
 */

const initialViewerSearch = (): Thunk<Promise<SearchResult>> => (
  dispatch,
  getState
) => {
  const params = Url.getSearchParams(getState())
  const program = brim.program(params.program, params.pins)
  const perPage = program.hasAnalytics() ? ANALYTIC_MAX_RESULTS : PER_PAGE
  const query = addHeadProc(program.string(), perPage)

  const tabId = Tabs.getActive(getState())
  const history = global.tabHistories.get(tabId)
  const {key} = history.location
  dispatch(Viewer.setSearchKey(tabId, key))

  const [from, to] = brim.span(params.spanArgs).toDateTuple()
  return dispatch(viewerSearch({query, from, to, keep: params.keep}))
}

export default initialViewerSearch
