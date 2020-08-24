/* @flow */
import React from "react"
import styled from "styled-components"

import {SearchBar} from "./SearchBar/mod"
import type {Styled} from "../types/styled"
import {Toolbar} from "./Toolbar/mod"
import SearchHeaderChart from "./SearchHeaderChart"

const Wrap: Styled<> = styled.div`
  background: var(--chrome-gradient);
  z-index: 1;
  padding: 12px;
  user-select: none;
`

const BorderBottom = styled.div`
  height: 1px;
  box-shadow: inset 0 0.5px 0 0 var(--cloudy);
`

export default function SearchPageHeader() {
  return (
    <>
      <Wrap className="search-page-header">
        <Toolbar />
        <SearchBar />
        <SearchHeaderChart />
      </Wrap>
      <BorderBottom />
    </>
  )
}
