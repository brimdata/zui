/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useState} from "react"
import styled from "styled-components"

import type {Styled} from "../types/styled"
import Current from "../state/Current"
import Link from "./common/Link"
import SearchInput from "./common/forms/SearchInput"
import submitArchiveSearch from "../flows/submitArchiveSearch"

const Container: Styled<> = styled.div`
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
  justify-content: center;
  align-items: center;

  .search-results {
    flex: 1;
  }
`

const InfoCard = styled.div`
  ${(p) => p.theme.typography.labelNormal}
  background: var(--snow);
  padding: 24px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.24);
  width: 300px;

  & > *:first-child {
    margin-top: 0;
  }
`

export default function TabArchiveSearch() {
  const dispatch = useDispatch()
  const space = useSelector(Current.getSpace)
  const [pattern, setPattern] = useState("")
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
            <SearchInput autoFocus value={pattern} onChange={onChange} />
          </form>
        </SearchWrapper>
      </Header>
      <ResultsWrapper>
        {/* <SearchResults /> */}
        <InfoCard>
          <p>Archive search is coming soon.</p>
          <Link href="https://github.com/brimsec/zq/tree/master/cmd/zar">
            Learn about ZAR
          </Link>
        </InfoCard>
      </ResultsWrapper>
    </Container>
  )
}
