import {mergeDefaultSpanArgs} from "app/search/utils/default-params"
import {decodeSearchParams} from "app/search/utils/search-params"
import {useMemo} from "react"
import {useSelector} from "react-redux"
import {useLocation} from "react-router"
import Current from "src/js/state/Current"

export default function useSearchParams() {
  const location = useLocation()
  const space = useSelector(Current.mustGetSpace)
  return useMemo(() => {
    const params = decodeSearchParams(location.search)
    const spanArgs = mergeDefaultSpanArgs(params.spanArgs, space)
    return {...params, spanArgs}
  }, [location.search, space.minTs(), space.maxTs()])
}

// For thunks and non-component contexts

export function getSearchParams() {
  return decodeSearchParams(global.tabHistory.location.search)
}
