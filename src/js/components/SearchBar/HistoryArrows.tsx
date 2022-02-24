import React from "react"
import styled from "styled-components"

import Back from "../icons/back-arrow"
import Button from "./Button"
import Forward from "../icons/forward-arrow"
import {useHistory} from "react-router"
import TabHistory from "src/app/router/tab-history"
import {useDispatch} from "react-redux"

const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export default function HistoryArrows() {
  const history = useHistory()
  const dispatch = useDispatch()
  // @ts-ignore history definitely has an index
  const canGoBack = history.index > 0
  // @ts-ignore history definitely has an index
  const canGoForward = history.length - 1 != history.index
  const back = () => dispatch(TabHistory.goBack())
  const forward = () => dispatch(TabHistory.goForward())

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
