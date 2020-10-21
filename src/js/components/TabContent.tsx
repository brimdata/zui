import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import Current from "../state/Current"
import TabSearch from "./TabSearch"
import TabSearchLoading from "./TabSearchLoading"
import TabWelcome from "./TabWelcome"
import brim from "../brim"
import MacSpinner from "./MacSpinner"
import styled from "styled-components"
import ConnectionError from "./ConnectionError"
import {initCurrentTab} from "../flows/initCurrentTab"

const SpinnerWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function TabContent() {
  const dispatch = useDispatch()
  const space = useSelector(Current.getSpace)
  const conn = useSelector(Current.getConnection)

  useEffect(() => {
    if (conn.status === "initial") dispatch(initCurrentTab())
  }, [])

  if (conn.status === "initial")
    return (
      <SpinnerWrap>
        <MacSpinner />
      </SpinnerWrap>
    )

  if (conn.status === "disconnected") return <ConnectionError conn={conn} />

  if (!space) {
    return <TabWelcome />
  }

  if (!brim.space(space).queryable()) {
    return <TabSearchLoading />
  }

  return <TabSearch />
}
