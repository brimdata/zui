import React, {useEffect, useState} from "react"

import MacSpinner from "./MacSpinner"
import styled from "styled-components"
import ToolbarButton from "./Toolbar/Button"
import {useDispatch} from "react-redux"
import {Workspace} from "../state/Workspaces/types"
import {login} from "../flows/workspace/login"
import {activateWorkspace} from "../flows/workspace/activateWorkspace"
import Workspaces from "../state/Workspaces"
import {toast} from "react-hot-toast"
import {globalDispatch} from "../state/GlobalContext"

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
  ws: Workspace
}

const Login = ({ws}: Props) => {
  const dispatch = useDispatch()
  const [isFetching, setIsFetching] = useState(false)
  const [cancelFunc, setCancelFunc] = useState(null)

  useEffect(() => () => cancelFunc && cancelFunc(), [cancelFunc])

  const onClick = async () => {
    setIsFetching(true)
    const cancel = await dispatch(
      login(ws, (accessToken) => {
        if (accessToken) {
          globalDispatch(Workspaces.setWorkspaceToken(ws.id, accessToken))
          dispatch(activateWorkspace(ws.id))
        } else {
          toast.error("Login failed")
        }
        setIsFetching(false)
      })
    )
    setCancelFunc(() => cancel)
  }

  const onCancel = () => {
    cancelFunc && cancelFunc()
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
