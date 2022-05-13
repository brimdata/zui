import {useLayoutEffect, useTransition} from "react"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import Current from "src/js/state/Current"
import Viewer from "src/js/state/Viewer"
import Results from "src/js/state/Results"
import useSelect from "src/app/core/hooks/use-select"
import brim from "src/js/brim"
import Url from "src/js/state/Url"
import {annotateQuery} from "src/js/flows/search/mod"

export function useResultsData() {
  const dispatch = useDispatch()
  const location = useSelector(Current.getLocation)
  const status = useSelector(Results.getStatus)
  const resultsKey = useSelector(Results.getKey)
  const values = useSelector(Results.getValues)
  const select = useSelect()
  const [_, startTransition] = useTransition()

  useLayoutEffect(() => {
    if (status === "INIT" || resultsKey !== location.key) {
      startTransition(() => {
        const tabId = select(Current.getTabId)
        const params = select(Url.getSearchParams)
        const poolId = select(Current.getPoolId)
        const program = brim.program(params.program, params.pins)

        let from = null
        let to = null
        if (params.spanArgs) {
          const [f, t] = brim.span(params.spanArgs).toDateTuple()
          from = f
          to = t
        }
        const query = annotateQuery(program.string(), {poolId, from, to})
        dispatch(Viewer.clear())
        dispatch(Results.fetchFirstPage(query, location.key, tabId))
      })
    }
  }, [location.key])

  return {
    values,
  }
}
