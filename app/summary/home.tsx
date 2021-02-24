import useSearchParams from "app/router/hooks/use-search-params"
import Summary from "ppl/summary/summary"
import React, {useLayoutEffect} from "react"
import {useDispatch} from "react-redux"
import SearchPageHeader from "src/js/components/SearchPageHeader"
import Search from "src/js/state/Search"

function InitSummaryParams({children}) {
  const dispatch = useDispatch()
  const params = useSearchParams()
  useLayoutEffect(() => {
    dispatch(Search.setSpanArgs(params.spanArgs))
  }, [params])

  return children
}

export default function SummaryHome() {
  return (
    <InitSummaryParams>
      <SearchPageHeader />
      <Summary />
    </InitSummaryParams>
  )
}
