import React, {useState} from "react"

import MacSpinner from "./MacSpinner"
import styled from "styled-components"
import ToolbarButton from "./Toolbar/Button"
import {useDispatch} from "react-redux"
import {Workspace} from "../state/Workspaces/types"
import {initWorkspace} from "../flows/initWorkspace"

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

  const onClick = async () => {
    setIsFetching(true)
    setCancelFunc(await dispatch(initWorkspace(ws, setIsFetching)))
  }

  const onCancel = () => {
    cancelFunc()
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
