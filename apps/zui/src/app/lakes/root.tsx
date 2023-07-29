import React, {useEffect, useLayoutEffect} from "react"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import ConnectionError from "src/js/components/ConnectionError"
import Login from "src/js/components/Login"
import MacSpinner from "src/js/components/MacSpinner"
import {updateStatus} from "src/js/flows/lake/update-status"
import Current from "src/js/state/Current"
import LakeStatuses from "src/js/state/LakeStatuses"
import styled from "styled-components"
import {initCurrentTab} from "src/js/flows/initCurrentTab"
import {invoke} from "src/core/invoke"

const SpinnerWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export function InitLake({children}) {
  const dispatch = useDispatch()
  const lake = useSelector(Current.getLake)
  const status = useSelector(LakeStatuses.get(lake?.id))

  useLayoutEffect(() => {
    if (status) return
    if (lake) dispatch(updateStatus(lake.id))
  }, [lake?.id, status])

  useEffect(() => {
    if (lake?.id) invoke("updatePluginLakeOp", {lakeId: lake.id})
  }, [lake?.id])

  switch (status) {
    case "disconnected":
      return <ConnectionError onRetry={() => dispatch(initCurrentTab())} />
    case "login-required":
      return <Login lake={lake} />
    case "connected":
    case "retrying":
      return children
    default:
      return (
        <SpinnerWrap>
          <MacSpinner />
        </SpinnerWrap>
      )
  }
}
