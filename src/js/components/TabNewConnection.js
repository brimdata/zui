/* @flow */
import React, {useCallback, useState} from "react"

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
import FormErrors from "./Preferences/FormErrors"
import type {Styled} from "../types/styled"

const TabNewConnectionWrapper: Styled<> = styled.div`
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

  .errors {
    h4 {
      margin-bottom: 0.25rem;
    }
    ul {
      margin-top: 1rem;
      line-height: 1.5;
    }
    a {
      color: var(--red);
      cursor: pointer;
      text-decoration: underline;
    }
    p {
      margin: 0;
      ${(props) => props.theme.typography.labelSmall}
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
  let [errors, setErrors] = useState([])
  const config = {
    host: {
      name: "host",
      label: "Host:",
      submit: (value) => dispatch(setConnection(toCluster({host: value})))
    }
  }

  const onSubmit = useCallback(async () => {
    if (!f) return
    let form = brim.form(f, config)

    if (await form.isValid()) {
      setErrors([])
      form.submit()
    } else {
      setErrors(form.getErrors())
    }
  }, [f, config])

  return (
    <TabNewConnectionWrapper>
      <SignInForm {...reactElementProps("login")}>
        <BrimTextLogo />
        <FormErrors errors={errors} />
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
        >
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
