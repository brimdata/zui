import InputField from "../common/forms/InputField"
import InputLabel from "../common/forms/InputLabel"
import TextInput from "../common/forms/TextInput"
import React, {useEffect, useRef, useState} from "react"
import styled from "styled-components"
import {FormConfig} from "../../brim/form"
import brim from "../../brim"
import {initWorkspace} from "../../flows/initWorkspace"
import useCallbackRef from "../hooks/useCallbackRef"
import {useDispatch, useSelector} from "react-redux"
import {isEmpty} from "lodash"
import MacSpinner from "../MacSpinner"
import ToolbarButton from "../Toolbar/Button"
import useEventListener from "../hooks/useEventListener"
import {Workspace} from "../../state/Workspaces/types"
import WorkspaceStatuses from "src/js/state/WorkspaceStatuses"
import Current from "../../state/Current"
import refreshSpaceNames from "../../flows/refreshSpaceNames"

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
  const dispatch = useDispatch()
  const [errors, setErrors] = useState([])
  const [formRef, setFormRef] = useCallbackRef()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {current: id} = useRef((workspace && workspace.id) || brim.randomHash())
  const currentStatus = useSelector(WorkspaceStatuses.get(id))
  const [prevStatus, setPrevStatus] = useState(currentStatus)
  const [cancelFunc, setCancelFunc] = useState(null)
  const isNewWorkspace = !workspace

  useEffect(() => {
    if (prevStatus === "authenticating") {
      if (currentStatus === "connected") {
        dispatch(Current.setWorkspaceId(id))
        dispatch(refreshSpaceNames())
        setIsSubmitting(false)
        setErrors([])
        onClose()
      } else if (currentStatus === "disconnected") {
        setIsSubmitting(false)
        setErrors([{message: "Authentication Failed"}])
      }
    }

    setPrevStatus(currentStatus)
  }, [currentStatus])

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

  const toWorkspace = ({host, name}: Partial<Workspace>): Workspace => {
    let [h, p] = host.split(":")
    if (!p) p = "9867"
    if (isNewWorkspace)
      return {id, host: h, port: p || "9867", name, authType: ""}
    return {...workspace, name}
  }

  const onCancel = () => {
    setErrors([])
    if (cancelFunc) cancelFunc()
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
        const cancel = await dispatch(
          initWorkspace(toWorkspace({host, name}), setIsSubmitting)
        )
        if (cancel && isSubmitting) {
          setCancelFunc(cancel)
          return
        }
      } catch (e) {
        console.log("error is: ", e)
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
              autoFocus
            />
          </InputField>
          {isNewWorkspace && (
            <InputField>
              <InputLabel>{config.host.label}</InputLabel>
              <StyledTextInput
                name={config.host.name}
                defaultValue={defaultHost}
              />
            </InputField>
          )}
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
        <ToolbarButton text="Cancel" onClick={onCancel} />
      </StyledFooter>
    </>
  )
}

export default WorkspaceForm
