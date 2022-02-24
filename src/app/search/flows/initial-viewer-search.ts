import brim from "src/js/brim"
import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "src/js/flows/config"
import {addHeadProc} from "src/js/lib/Program"
import {Thunk} from "src/js/state/types"
import Url from "src/js/state/Url"
import Viewer from "src/js/state/Viewer"
import Tabs from "src/js/state/Tabs"
import {viewerSearch} from "./viewer-search"

/**
 * Initial search to fill the viewer, as opposed to the "next-page"
 * search which allows for the inifinite scroll behavior.
 */

const initialViewerSearch = (): Thunk<any> => (dispatch, getState) => {
  const params = Url.getSearchParams(getState())
  const program = brim.program(params.program, params.pins)
  const perPage = program.hasAnalytics() ? ANALYTIC_MAX_RESULTS : PER_PAGE
  const query = addHeadProc(program.string(), perPage)

  const tabId = Tabs.getActive(getState())
  const history = global.tabHistories.get(tabId)
  const {key} = history.location
  dispatch(Viewer.setSearchKey(tabId, key))

  let from = null
  let to = null
  if (params.spanArgs) {
    const [f, t] = brim.span(params.spanArgs).toDateTuple()
    from = f
    to = t
  }
  return dispatch(viewerSearch({query, from, to}))
}

export default initialViewerSearch
