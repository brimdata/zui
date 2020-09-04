/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React from "react"
import styled from "styled-components"

import type {Styled} from "../../types/styled"
import Back from "../icons/back-arrow.svg"
import Button from "./Button"
import Forward from "../icons/forward-arrow.svg"
import SearchBar from "../../state/SearchBar"
import Tab from "../../state/Tab"

const Wrap: Styled<> = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export default function HistoryArrows() {
  const dispatch = useDispatch()
  const canGoBack = useSelector(Tab.canGoBack)
  const canGoForward = useSelector(Tab.canGoForward)
  const back = () => dispatch(SearchBar.goBack())
  const forward = () => dispatch(SearchBar.goForward())

  return (
    <Wrap>
      <Button disabled={!canGoBack} onClick={back}>
        <Back />
      </Button>
      <Button disabled={!canGoForward} onClick={forward}>
        <Forward />
      </Button>
    </Wrap>
  )
}
