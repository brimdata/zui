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
import WorkspaceStatuses from "../state/WorkspaceStatuses"
import get from "lodash/get"
import WorkspaceChooserPage from "./WorkspaceChooserPage"
import Login from "./Login"

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
  const ws = useSelector(Current.getWorkspace)
  const id = get(ws, ["id"], "")
  const wsStatus = useSelector(WorkspaceStatuses.get(id))

  useEffect(() => {
    if (!wsStatus) {
      dispatch(initCurrentTab())
    }
  }, [wsStatus])

  if (!ws) return <WorkspaceChooserPage />

  if (!wsStatus)
    return (
      <SpinnerWrap>
        <MacSpinner />
      </SpinnerWrap>
    )

  if (wsStatus === "disconnected") return <ConnectionError workspace={ws} />
  if (wsStatus === "login-required") return <Login ws={ws.serialize()} />

  if (!space) {
    return <TabWelcome />
  }

  if (!brim.space(space).queryable()) {
    return <TabSearchLoading />
  }

  return <TabSearch />
}
