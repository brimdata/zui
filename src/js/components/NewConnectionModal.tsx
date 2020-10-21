import React, {useCallback, useState} from "react"

import {Cluster} from "../state/Clusters/types"
import BrimTextLogo from "./BrimTextLogo"
import InputField from "./common/forms/InputField"
import InputLabel from "./common/forms/InputLabel"
import TextInput from "./common/forms/TextInput"
import brim from "../brim"
import useCallbackRef from "./hooks/useCallbackRef"
import styled from "styled-components"
import {useDispatch} from "react-redux"
import FormErrors from "./Preferences/FormErrors"
import ModalBox from "./ModalBox/ModalBox"
import TextContent from "./TextContent"
import {isEmpty} from "lodash"
import {FormConfig} from "../brim/form"
import MacSpinner from "./MacSpinner"
import {initConnection} from "../flows/initConnection"

const LabelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0;

  p {
    margin: 0 0 4px 4px;
  }
`

const StyledModalBox = styled(ModalBox)`
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

  ${InputField} {
    margin-bottom: 12px;
  }

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

function toCluster({host, name}): Cluster {
  // set defaults
  let [h, p] = host.split(":")
  if (!p) p = "9867"
  const hostPort = `${h}:${p}`
  return {
    host: h,
    port: p,
    id: hostPort,
    // default name to use host:port if not provided
    name: name || hostPort,
    username: undefined,
    password: undefined,
    status: "initial"
  }
}

export default function NewConnectionModal() {
  const dispatch = useDispatch()
  const [f, formRef] = useCallbackRef()
  const [errors, setErrors] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const config: FormConfig = {
    host: {
      name: "host",
      label: "Host",
      check: (value) => [!isEmpty(value), "must not be blank"]
    },
    name: {
      name: "name",
      label: "Name"
    }
  }

  const onClose = () => setErrors([])

  const onSubmit = useCallback(
    async (closeModal) => {
      if (!f) return
      const form = brim.form(f, config)

      if (await form.isValid()) {
        const {host, name} = form.getFields().reduce((obj, field) => {
          obj[field.name] = field.value
          return obj
        }, {})
        try {
          setIsFetching(true)
          await dispatch(initConnection(toCluster({host, name})))
        } catch {
          setErrors([{message: "Cannot connect to host"}])
          return
        } finally {
          setIsFetching(false)
        }
        closeModal()
      } else {
        setErrors(form.getErrors())
      }
    },
    [f, config]
  )

  const buttons = [
    {label: "Cancel", click: (closeModal) => closeModal()},
    {
      label: isFetching ? "" : "Connect",
      click: onSubmit,
      icon: isFetching ? <MacSpinner /> : null,
      disabled: isFetching
    }
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
              <LabelWrapper>
                <InputLabel>{config.name.label}</InputLabel>
                <p>(defaults to host if omitted)</p>
              </LabelWrapper>
              <TextInput name={config.name.name} autoFocus />
            </InputField>
            <InputField>
              <LabelWrapper>
                <InputLabel>{config.host.label}</InputLabel>
                <p>(port defaults to 9867 if omitted)</p>
              </LabelWrapper>
              <TextInput name={config.host.name} />
            </InputField>
          </form>
        </SignInForm>
      </TextContent>
    </StyledModalBox>
  )
}
