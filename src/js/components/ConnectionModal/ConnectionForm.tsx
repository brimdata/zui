import InputField from "../common/forms/InputField"
import InputLabel from "../common/forms/InputLabel"
import TextInput from "../common/forms/TextInput"
import React, {useEffect} from "react"
import styled from "styled-components"
import {FormConfig} from "../../brim/form"
import brim from "../../brim"
import {initConnection} from "../../flows/initConnection"
import useCallbackRef from "../hooks/useCallbackRef"
import {useDispatch} from "react-redux"
import {Cluster} from "../../state/Clusters/types"
import {isEmpty} from "lodash"

const Buttons = styled.div``
const SignInForm = styled.div`
  margin: 25px auto;

  ${InputField} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
  }

  ${InputLabel} {
    margin-bottom: 0;
  }

  ${Buttons} {
    margin-top: 48px;
    display: flex;
    justify-content: flex-end;

    button {
      min-width: 80px;
    }
  }
`

const StyledTextInput = styled(TextInput)`
  width: 300px;
`

type Props = {
  isSubmitting: boolean
  withSubmit: (fn: () => Promise<void>) => void
  conn?: Cluster
}

const ConnectionForm = ({isSubmitting, withSubmit, conn}: Props) => {
  const dispatch = useDispatch()
  const [formRef, setFormRef] = useCallbackRef()

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

  const toCluster = ({host, name}): Cluster => {
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

  const onSubmit = async () => {
    if (!formRef) return
    const form = brim.form(formRef, config)

    if (await form.isValid()) {
      const {host, name} = form.getFields().reduce((obj, field) => {
        obj[field.name] = field.value
        return obj
      }, {})
      try {
        await dispatch(initConnection(toCluster({host, name})))
      } catch {
        throw [{message: "Cannot connect to host"}]
      }
    } else {
      throw form.getErrors()
    }
  }

  useEffect(() => {
    if (!isSubmitting) return
    withSubmit(onSubmit)
  }, [isSubmitting])

  const defaultName = (conn && conn.name) || ""
  const defaultHost = (conn && [conn.host, conn.port].join(":")) || ""

  return (
    <SignInForm>
      <form ref={setFormRef}>
        <InputField>
          <InputLabel>{config.name.label}</InputLabel>
          <StyledTextInput
            name={config.name.name}
            defaultValue={defaultName}
            autoFocus
          />
        </InputField>
        <InputField>
          <InputLabel>{config.host.label}</InputLabel>
          <StyledTextInput name={config.host.name} defaultValue={defaultHost} />
        </InputField>
      </form>
    </SignInForm>
  )
}

export default ConnectionForm
