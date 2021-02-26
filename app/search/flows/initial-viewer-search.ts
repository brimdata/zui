import brim from "src/js/brim"
import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "src/js/flows/config"
import {addHeadProc} from "src/js/lib/Program"
import Current from "src/js/state/Current"
import {viewerSearch} from "./viewer-search"

const initialViewerSearch = () => (dispatch, getState) => {
  const params = Current.getSearchParams(getState())
  const program = brim.program(params.program, params.pins)
  const perPage = program.hasAnalytics() ? ANALYTIC_MAX_RESULTS : PER_PAGE
  const query = addHeadProc(program.string(), perPage)
  const [from, to] = brim.span(params.spanArgs).toDateTuple()

  return dispatch(viewerSearch({query, from, to}))
}

export default initialViewerSearch
