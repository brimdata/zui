/* @flow */

import {useSelector} from "react-redux"
import React from "react"
import styled from "styled-components"

import type {Styled} from "../../types/styled"
import SearchBar from "../../state/SearchBar"
import Warning from "../icons/warning-sm.svg"

const Wrap: Styled<> = styled.div`
  display: flex;
  align-items: center;
  color: white;
  background: var(--green);
  font-size: 11px;
  padding: 6px 12px;
  margin: 0 12px;
  box-shadow: 0 0.5px 2px 1px rgba(0, 0, 0, 0.15);
  border-radius: 0 0 3px 3px;

  svg {
    fill: white;
    height: 16px;
    width: 16px;
    margin-right: 12px;
  }
`

export default function Error() {
  const error = useSelector(SearchBar.getSearchBarError)
  if (!error) return null
  return (
    <Wrap>
      <div className="warning-icon">
        <Warning />
      </div>
      <span>{error}</span>
    </Wrap>
  )
}
