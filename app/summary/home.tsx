import useSearchParams from "app/router/hooks/use-search-params"
import {Toolbar} from "app/toolbar/toolbar"
import Summary from "ppl/summary/summary"
import React, {useLayoutEffect} from "react"
import {useDispatch} from "react-redux"
import {SearchBar} from "src/js/components/SearchBar/mod"
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
      <SearchPageHeader>
        <Toolbar />
        <SearchBar />
      </SearchPageHeader>
      <Summary />
    </InitSummaryParams>
  )
}
