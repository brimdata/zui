import {Toolbar} from "app/toolbar/toolbar"
import Summary from "ppl/summary/summary"
import React, {useLayoutEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {SearchBar} from "src/js/components/SearchBar/mod"
import SearchPageHeader from "src/js/components/SearchPageHeader"
import Current from "src/js/state/Current"
import Search from "src/js/state/Search"

function InitSummaryParams({children}) {
  const dispatch = useDispatch()
  const params = useSelector(Current.getSearchParams)
  useLayoutEffect(() => {
    dispatch(Search.setSpanArgs(params.spanArgs))
  }, [])

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
