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
import ConnectionStatuses from "../state/ConnectionStatuses"
import get from "lodash/get"
import ConnectionChooserPage from "./ConnectionChooserPage"

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
  const id = get(conn, ["id"], "")
  const connStatus = useSelector(ConnectionStatuses.get(id))

  useEffect(() => {
    if (conn && !connStatus) {
      dispatch(initCurrentTab())
    }
  }, [conn, connStatus])

  if (!conn) return <ConnectionChooserPage />

  if (!connStatus)
    return (
      <SpinnerWrap>
        <MacSpinner />
      </SpinnerWrap>
    )

  if (connStatus === "disconnected") return <ConnectionError conn={conn} />

  if (!space) {
    return <TabWelcome />
  }

  if (!brim.space(space).queryable()) {
    return <TabSearchLoading />
  }

  return <TabSearch />
}
