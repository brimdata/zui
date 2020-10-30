import InputField from "../common/forms/InputField"
import InputLabel from "../common/forms/InputLabel"
import TextInput from "../common/forms/TextInput"
import React, {useState} from "react"
import styled from "styled-components"
import {FormConfig} from "../../brim/form"
import brim from "../../brim"
import {initConnection} from "../../flows/initConnection"
import useCallbackRef from "../hooks/useCallbackRef"
import {useDispatch} from "react-redux"
import {Cluster} from "../../state/Clusters/types"
import {isEmpty} from "lodash"
import MacSpinner from "../MacSpinner"
import ToolbarButton from "../Toolbar/Button"
import useEventListener from "../hooks/useEventListener"

const SignInForm = styled.div`
  margin: 0 auto 24px;
  padding-left: 24px;

  ${InputField} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 18px;

    input {
      background: rgba(255, 255, 255, 0.83);
    }

    &:last-child {
      margin: 0;
    }
  }

  ${InputLabel} {
    margin-bottom: 0;
    margin-right: 10px;
  }
`

const Errors = styled.ul`
  list-style: none;
  margin: 0 0 12px;
  line-height: 1.5;

  a {
    color: var(--red);
    cursor: pointer;
    text-decoration: underline;
  }

  p {
    ${(p) => p.theme.typography.labelSmall}
    margin: 0;
  }
`

const StyledFooter = styled.footer`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  background: transparent;
  margin-bottom: 12px;
  button {
    margin-left: 12px;
  }
`

const StyledTextInput = styled(TextInput)`
  width: 280px;
`

type Props = {
  conn?: Cluster
  onClose: () => void
}

const ConnectionForm = ({onClose, conn}: Props) => {
  const dispatch = useDispatch()
  const [errors, setErrors] = useState([])
  const [formRef, setFormRef] = useCallbackRef()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const config: FormConfig = {
    host: {
      name: "host",
      label: "Host",
      check: (value) => [!isEmpty(value), "must not be blank"]
    },
    name: {
      name: "name",
      label: "Name",
      check: (value) => [!isEmpty(value), "must not be blank"]
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
      name: name,
      username: undefined,
      password: undefined,
      status: "initial"
    }
  }

  const onCancel = () => {
    setErrors([])
    onClose()
  }

  const onSave = async () => {
    if (!formRef) return
    setIsSubmitting(true)

    const form = brim.form(formRef, config)

    if (await form.isValid()) {
      const {host, name} = form.getFields().reduce((obj, field) => {
        obj[field.name] = field.value
        return obj
      }, {})
      try {
        await dispatch(initConnection(toCluster({host, name})))
      } catch {
        setIsSubmitting(false)
        setErrors([{message: "Cannot connect to host"}])
        return
      }
    } else {
      setErrors(form.getErrors)
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)
    setErrors([])
    onClose()
  }

  function keyUp(e) {
    if (e.key === "Enter") {
      e.stopPropagation()
      e.preventDefault()
      onSave()
    }
  }

  useEventListener(document, "keyup", keyUp, [formRef])

  const defaultName = (conn && conn.name) || ""
  const defaultHost = (conn && [conn.host, conn.port].join(":")) || ""

  return (
    <>
      {errors.length > 0 && (
        <Errors>
          {errors.map(({label, message, input}, i) => (
            <li key={i}>
              <a onClick={() => input.focus()}>{label}</a> {message}
            </li>
          ))}
        </Errors>
      )}
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
            <StyledTextInput
              name={config.host.name}
              defaultValue={defaultHost}
            />
          </InputField>
        </form>
      </SignInForm>
      <StyledFooter>
        <ToolbarButton
          isPrimary
          text={isSubmitting ? "" : "Save"}
          icon={isSubmitting ? <MacSpinner light /> : null}
          disabled={isSubmitting}
          onClick={onSave}
        />
        <ToolbarButton text="Cancel" onClick={onCancel} />
      </StyledFooter>
    </>
  )
}

export default ConnectionForm
