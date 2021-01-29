import InputField from "../common/forms/InputField"
import InputLabel from "../common/forms/InputLabel"
import TextInput from "../common/forms/TextInput"
import React, {useEffect, useRef, useState} from "react"
import styled from "styled-components"
import {FormConfig} from "../../brim/form"
import brim from "../../brim"
import useCallbackRef from "../hooks/useCallbackRef"
import {useDispatch} from "react-redux"
import {isEmpty} from "lodash"
import MacSpinner from "../MacSpinner"
import ToolbarButton from "../../../../app/toolbar/button"
import useEventListener from "../hooks/useEventListener"
import {Workspace} from "../../state/Workspaces/types"
import {remote} from "electron"
import {buildWorkspace} from "../../flows/workspace/buildWorkspace"
import {initWorkspace} from "../../flows/workspace/initWorkspace"
import {getAuthCredentials} from "../../flows/workspace/getAuthCredentials"
import {AppDispatch} from "../../state/types"
import {login} from "../../flows/workspace/login"

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
  workspace?: Workspace
  onClose: () => void
}

const WorkspaceForm = ({onClose, workspace}: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const [errors, setErrors] = useState([])
  const [formRef, setFormRef] = useCallbackRef<HTMLFormElement>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {current: id} = useRef((workspace && workspace.id) || brim.randomHash())
  const [cancelFunc, setCancelFunc] = useState(null)
  const isNewWorkspace = !workspace

  useEffect(() => () => cancelFunc && cancelFunc(), [cancelFunc])

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

  const setFields = ({hostPort, name}, ws?: Workspace): Partial<Workspace> => {
    let [host, port] = hostPort.split(":")
    if (!port) port = "9867"
    if (ws) return {...ws, host, port, name}
    return {id, host, port, name}
  }

  const onClickClose = () => {
    setErrors([])
    onClose()
  }

  const onCancel = () => {
    cancelFunc && cancelFunc()
    setIsSubmitting(false)
  }

  const connectWorkspace = (ws) => {
    dispatch(initWorkspace(ws, "connected"))
    setIsSubmitting(false)
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
        const ws = await dispatch(
          buildWorkspace(setFields({hostPort: host, name}, workspace))
        )

        if (ws.authType === "none") return connectWorkspace(ws)

        const token = await dispatch(getAuthCredentials(ws))
        if (token)
          return connectWorkspace({
            ...ws,
            authData: {...ws.authData, accessToken: token}
          })

        // must login, ask user
        const dialogOpts = {
          type: "info",
          buttons: ["Continue", "Cancel"],
          title: "Redirect to Browser",
          message:
            "This Workspace requires authentication. Continue to login with your browser?"
        }
        const dialogChoice = await remote.dialog.showMessageBox(dialogOpts)
        if (dialogChoice.response === 1) {
          setIsSubmitting(false)
          return
        }

        // begin login
        const cancel = await dispatch(
          login(ws, (accessToken) => {
            setIsSubmitting(false)
            if (!accessToken) setErrors([{message: "Login failed"}])
            else
              connectWorkspace({
                ...ws,
                authData: {...ws.authData, accessToken}
              })
          })
        )
        setCancelFunc(() => cancel)
        return
      } catch (e) {
        console.log("error is: ", e)
        setIsSubmitting(false)
        setErrors([{message: "Cannot connect to host"}])
        return
      }
    }
    setErrors(form.getErrors)
    setIsSubmitting(false)
    return
  }

  function keyUp(e) {
    if (e.key === "Enter") {
      e.stopPropagation()
      e.preventDefault()
      onSave()
    }
  }

  useEventListener(document, "keyup", keyUp, [formRef])

  const defaultName = (workspace && workspace.name) || ""
  const defaultHost =
    (workspace && [workspace.host, workspace.port].join(":")) || ""

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
              disabled={isSubmitting}
              autoFocus
            />
          </InputField>
          <InputField>
            <InputLabel>{config.host.label}</InputLabel>
            <StyledTextInput
              name={config.host.name}
              defaultValue={defaultHost}
              disabled={isSubmitting}
            />
          </InputField>
        </form>
      </SignInForm>
      <StyledFooter>
        <ToolbarButton
          isPrimary
          text={isSubmitting ? "" : isNewWorkspace ? "Connect" : "Save"}
          icon={isSubmitting ? <MacSpinner light /> : null}
          disabled={isSubmitting}
          onClick={onSave}
        />
        <ToolbarButton
          text={isSubmitting ? "Cancel" : "Close"}
          onClick={isSubmitting ? onCancel : onClickClose}
        />
      </StyledFooter>
    </>
  )
}

export default WorkspaceForm
