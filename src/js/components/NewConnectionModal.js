/* @flow */
import React, {useCallback, useState} from "react"

import type {Cluster} from "../state/Clusters/types"
import BrimTextLogo from "./BrimTextLogo"
import InputField from "./common/forms/InputField"
import InputLabel from "./common/forms/InputLabel"
import TextInput from "./common/forms/TextInput"
import brim from "../brim"
import useCallbackRef from "./hooks/useCallbackRef"
import styled from "styled-components"
import {useDispatch} from "react-redux"
import {setConnection} from "../flows/setConnection"
import FormErrors from "./Preferences/FormErrors"
import type {Styled} from "../types/styled"
import ModalBox from "./ModalBox/ModalBox"
import TextContent from "./TextContent"
import {isEmpty} from "lodash"

const StyledModalBox: Styled<> = styled(ModalBox)`
  min-width: 500px;
  background: linear-gradient(to bottom, var(--snow) 50%, white);

  .brim-text-logo {
    display: block;
    margin: 0 auto 48px auto;
  }
`

const Buttons = styled.div``
const SignInForm = styled.div`
  margin: 50px auto;
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

export default function NewConnectionModal() {
  const dispatch = useDispatch()
  const [f, formRef] = useCallbackRef<HTMLFormElement>()
  let [errors, setErrors] = useState([])
  const config = {
    host: {
      name: "host",
      label: "Host",
      submit: (value) => dispatch(setConnection(toCluster({host: value}))),
      check: (value) => [!isEmpty(value), "must not be blank"]
    }
  }

  const onClose = () => setErrors([])

  const onSubmit = useCallback(
    async (closeModal) => {
      if (!f) return
      let form = brim.form(f, config)

      if (await form.isValid()) {
        form.submit()
        closeModal()
      } else {
        setErrors(form.getErrors())
      }
    },
    [f, config]
  )

  const buttons = [
    {label: "Cancel", click: (closeModal) => closeModal()},
    {label: "Connect", click: onSubmit}
  ]

  return (
    <StyledModalBox
      title="New Connection"
      name="new-connection"
      buttons={buttons}
      onClose={onClose}
    >
      <TextContent>
        <SignInForm>
          <form ref={formRef}>
            <BrimTextLogo />
            <FormErrors errors={errors} />
            <InputField>
              <InputLabel>{config.host.label}</InputLabel>
              <TextInput name={config.host.name} autoFocus />
            </InputField>
          </form>
        </SignInForm>
      </TextContent>
    </StyledModalBox>
  )
}
