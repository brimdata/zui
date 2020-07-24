/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useState} from "react"
import styled from "styled-components"

import SearchInput from "./common/forms/SearchInput"
import SearchResults from "./SearchResults/SearchResults"
import Tab from "../state/Tab"
import submitArchiveSearch from "../flows/submitArchiveSearch"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Header = styled.div`
  padding: 12px;
`

const SearchWrapper = styled.div`
  margin: 0 auto;
  max-width: 600px;
`

const ResultsWrapper = styled.div`
  flex: 1;
  border-top: 1px solid var(--cloudy);
  display: flex;
  flex-direction: column;

  .search-results {
    flex: 1;
  }
`

export default function TabArchiveSearch() {
  const dispatch = useDispatch()
  const space = useSelector(Tab.space)
  const [pattern, setPattern] = useState("uri=/wordpress/wp-login.php")
  const onSubmit = async (e) => {
    e.preventDefault()
    dispatch(submitArchiveSearch([pattern]))
  }
  const onChange = (e) => setPattern(e.target.value)

  return (
    <Container>
      <Header>
        <h4>{space.name}</h4>
        <SearchWrapper>
          <form onSubmit={onSubmit}>
            <SearchInput value={pattern} onChange={onChange} />
          </form>
        </SearchWrapper>
      </Header>
      <ResultsWrapper>
        <SearchResults />
      </ResultsWrapper>
    </Container>
  )
}
