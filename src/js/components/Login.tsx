import React, {useEffect, useRef, useState} from "react"
import {toast} from "react-hot-toast"
import {useDispatch} from "react-redux"
import styled from "styled-components"
import {BrimWorkspace} from "../brim"
import {activateWorkspace} from "../flows/workspace/activateWorkspace"
import {login} from "../flows/workspace/login"
import {globalDispatch} from "../state/GlobalContext"
import {AppDispatch} from "../state/types"
import Workspaces from "../state/Workspaces"

import ToolbarButton from "../../../app/toolbar/button"
import MacSpinner from "./MacSpinner"

const PageWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`

const StyledHeader = styled.h1`
  margin: 110px 0 0 0;
  color: var(--aqua);
  ${(p) => p.theme.typography.headingPage}
`

const StyledP = styled.p`
  margin: 18px 0 0 0;
  color: ${(p) => p.theme.colors.aqua};
  ${(p) => p.theme.typography.labelNormal}
`

const StyledButton = styled(ToolbarButton)`
  margin: 36px 0 0 0;
`

type Props = {
  workspace: BrimWorkspace
}

const Login = ({workspace}: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isFetching, setIsFetching] = useState(false)
  const ctlRef = useRef(new AbortController())

  useEffect(() => () => ctlRef.current.abort(), [])

  const onClick = async () => {
    setIsFetching(true)
    try {
      ctlRef.current = new AbortController()
      const accessToken = await dispatch(
        login(workspace, ctlRef.current.signal)
      )
      await globalDispatch(
        Workspaces.setWorkspaceToken(workspace.id, accessToken)
      )
      await dispatch(activateWorkspace(workspace.id))
    } catch {
      toast.error("Login failed")
    }
    setIsFetching(false)
  }

  const onCancel = () => {
    ctlRef.current.abort()
    setIsFetching(false)
  }

  return (
    <PageWrap>
      <StyledHeader>Login</StyledHeader>
      <StyledP>
        {"This workspace requires authentication, please login to continue."}
      </StyledP>
      <StyledButton
        onClick={isFetching ? onCancel : onClick}
        text={isFetching ? "Cancel" : "Login"}
        icon={isFetching ? <MacSpinner /> : null}
      />
    </PageWrap>
  )
}

export default Login
