import React, {useEffect, useRef, useState} from "react"
import {toast} from "react-hot-toast"
import {useDispatch} from "react-redux"
import styled from "styled-components"
import {BrimLake} from "../brim"
import {updateStatus} from "../flows/workspace/update-status"
import {login} from "../flows/workspace/login"
import {AppDispatch} from "../state/types"
import Lakes from "../state/Lakes"

import ToolbarButton from "../../../app/toolbar/button"
import MacSpinner from "./MacSpinner"
import {isString} from "lodash"

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
  color: var(--aqua);
  ${(p) => p.theme.typography.labelNormal}
`

const StyledButton = styled(ToolbarButton)`
  margin: 36px 0 0 0;
`

type Props = {
  workspace: BrimLake
}

const Login = ({workspace}: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ctlRef = useRef(new AbortController())

  useEffect(() => () => ctlRef.current.abort(), [])

  const onClick = async () => {
    setError(null)
    setIsFetching(true)
    try {
      ctlRef.current = new AbortController()
      const accessToken = await dispatch(
        login(workspace, ctlRef.current.signal)
      )
      dispatch(Lakes.setLakeToken(workspace.id, accessToken))
      await dispatch(updateStatus(workspace.id))
    } catch (e) {
      if (e instanceof Error) setError(e.message)
      if (isString(e)) setError(e)
      console.error(e)
      toast.error("Login failed")
      setIsFetching(false)
    }
  }

  const onCancel = () => {
    ctlRef.current.abort()
    setIsFetching(false)
  }

  return (
    <PageWrap>
      <StyledHeader>Login</StyledHeader>
      <StyledP>
        This lake requires authentication. Please log in to continue.
      </StyledP>
      {error && <StyledP>Error: {error}</StyledP>}
      <StyledButton
        onClick={isFetching ? onCancel : onClick}
        text={isFetching ? "Cancel" : "Login"}
        icon={isFetching ? <MacSpinner /> : null}
      />
    </PageWrap>
  )
}

export default Login
