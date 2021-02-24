import {mergeDefaultSpanArgs} from "app/search/utils/default-params"
import {decodeSearchParams, encodeSpanArg} from "app/search/utils/search-params"
import {useMemo} from "react"
import {useSelector} from "react-redux"
import {useLocation} from "react-router"
import {Span} from "src/js/brim"
import Current from "src/js/state/Current"
import {SpanArgs} from "src/js/state/Search/types"

type SearchParams = {
  program: string
  pins: []
  spanArgs: SpanArgs
  spanArgsFocus: Span | null
}

export default function useSearchParams(): SearchParams {
  const location = useLocation()
  const space = useSelector(Current.mustGetSpace)
  return useMemo<SearchParams>(() => {
    const params = decodeSearchParams(location.search)
    const spanArgs = mergeDefaultSpanArgs(params.spanArgs, space)
    const spanArgsFocus =
      params.spanArgsFocus[0] && params.spanArgsFocus[1]
        ? params.spanArgsFocus
        : null

    return {...params, spanArgs, spanArgsFocus} as SearchParams
  }, [
    location.search,
    encodeSpanArg(space.minTs()),
    encodeSpanArg(space.maxTs())
  ])
}

// For thunks and non-component contexts

export function getSearchParams() {
  return decodeSearchParams(global.tabHistory.location.search)
}
