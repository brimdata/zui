import {decodeSearchParams} from "app/search/utils/search-params"
import {useMemo} from "react"
import {useLocation} from "react-router"

export default function useSearchParams() {
  const location = useLocation()
  return useMemo(() => decodeSearchParams(location.search), [location.search])
}
