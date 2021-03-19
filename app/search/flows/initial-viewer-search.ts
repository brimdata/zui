import brim from "src/js/brim"
import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "src/js/flows/config"
import {addHeadProc} from "src/js/lib/Program"
import Url from "src/js/state/Url"
import {viewerSearch} from "./viewer-search"

/**
 * Initial search to fill the viewer, as opposed to the "next-page"
 * search which allows for the inifinite scroll behavior.
 */

const initialViewerSearch = () => (dispatch, getState) => {
  const params = Url.getSearchParams(getState())
  const program = brim.program(params.program, params.pins)
  const perPage = program.hasAnalytics() ? ANALYTIC_MAX_RESULTS : PER_PAGE
  const query = addHeadProc(program.string(), perPage)
  const [from, to] = brim.span(params.spanArgs).toDateTuple()

  return dispatch(viewerSearch({query, from, to, keep: params.keep}))
}

export default initialViewerSearch
