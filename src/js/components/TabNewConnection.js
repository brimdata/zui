/* @flow */
import React from "react"

import type {Cluster} from "../state/Clusters/types"
import {reactElementProps} from "../test/integration"
import BrimTextLogo from "./BrimTextLogo"
import ErrorNotice from "./ErrorNotice"
import InputField from "./common/forms/InputField"
import InputLabel from "./common/forms/InputLabel"
import TextInput from "./common/forms/TextInput"
import ToolbarButton from "./ToolbarButton"
import brim from "../brim"
import useCallbackRef from "./hooks/useCallbackRef"
import styled from "styled-components"
import {useDispatch} from "react-redux"
import {setConnection} from "../flows/setConnection"

const TabNewConnectionWrapper = styled.div`
  height: 100%;
  background: linear-gradient(to bottom, var(--snow) 50%, white);

  .brim-text-logo {
    display: block;
    margin: 0 auto 48px auto;
  }
`

const Buttons = styled.div``
const SignInForm = styled.div`
  margin: 10vh auto 0;
  width: 240px;

  ${Buttons} {
    margin-top: 48px;
    display: flex;
    justify-content: flex-end;

    button {
      min-width: 80px;
    }
  }
`

function toCluster({host, ...rest}): Cluster {
  let [h, p] = host.split(":")
  // $FlowFixMe
  return {...rest, host: h, port: p || "9867", id: host}
}

export default function TabSignIn() {
  const dispatch = useDispatch()
  const [f, formRef] = useCallbackRef()
  const config = {
    host: {
      name: "host",
      label: "Host:"
    }
  }

  function onSubmit(e) {
    e.preventDefault()
    if (!f) return
    const form = brim.form(f, config)
    const cluster = toCluster(form.getData())
    dispatch(setConnection(cluster))
  }

  return (
    <TabNewConnectionWrapper>
      <SignInForm {...reactElementProps("login")}>
        <form ref={formRef} onSubmit={onSubmit}>
          <BrimTextLogo />
          <InputField>
            <InputLabel>{config.host.label}</InputLabel>
            <TextInput name={config.host.name} required autoFocus />
          </InputField>
          <Buttons>
            <ToolbarButton text="Connect" />
          </Buttons>
        </form>
        <ErrorNotice />
      </SignInForm>
    </TabNewConnectionWrapper>
  )
}
