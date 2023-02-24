import {nanoid} from "@reduxjs/toolkit"
import {isEmpty} from "lodash"
import React, {useEffect, useRef, useState} from "react"
import {useDispatch} from "react-redux"
import styled from "styled-components"
import form, {FormConfig} from "../../brim/form"
import {buildAndAuthenticateLake} from "../../flows/lake/buildAndAuthenticateLake"
import {AppDispatch} from "../../state/types"
import {Lake} from "../../state/Lakes/types"
import InputField from "../common/forms/InputField"
import InputLabel from "../common/forms/InputLabel"
import TextInput from "../common/forms/TextInput"
import useCallbackRef from "../hooks/useCallbackRef"
import useEventListener from "../hooks/useEventListener"
import {isDefaultLake} from "../../initializers/initLakeParams"
import {SubmitButton} from "src/components/submit-button"
import {InputButton} from "src/components/input-button"
import {LakeModel} from "src/js/brim/lake"

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
  lake?: LakeModel
  onClose: () => void
}

const LakeForm = ({onClose, lake}: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const [errors, setErrors] = useState([])
  const [formRef, setFormRef] = useCallbackRef<HTMLFormElement>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {current: id} = useRef((lake && lake.id) || nanoid())
  const ctlRef = useRef(new AbortController())
  const isNewLake = !lake

  useEffect(() => () => ctlRef.current.abort(), [])

  const config: FormConfig = {
    host: {
      name: "host",
      label: "Lake URL",
      type: "string",
      defaultValue: "",
      check: (value) => {
        if (isEmpty(value)) return [false, "must not be blank"]
        try {
          new URL("/", value)
        } catch (e) {
          return [false, "invalid URL"]
        }
        let isValid = true
        if (!isNewLake && isDefaultLake(lake)) {
          const {host, port} = lake
          isValid = value === host || value === [host, port].join(":")
        }
        return [isValid, "cannot change URL of default lake"]
      },
    },
    name: {
      name: "name",
      label: "Name",
      type: "string",
      defaultValue: "",
      check: (value) => [!isEmpty(value), "must not be blank"],
    },
  }

  const setFields = ({hostPort, name}, l?: Lake): Partial<Lake> => {
    const {port, hostname, protocol} = new URL("/", hostPort)
    const host = [protocol, hostname].join("//")
    if (l) return {...l, host, port, name}
    return {id, host, port, name}
  }

  const onClickClose = () => {
    setErrors([])
    onClose()
  }

  const onCancel = () => {
    ctlRef.current.abort()
  }

  const onSave = async () => {
    if (!formRef) return
    setIsSubmitting(true)

    const f = form(formRef, config)

    if (!(await f.isValid())) {
      setErrors(f.getErrors)
      setIsSubmitting(false)
      return
    }

    const {host, name} = f.getFields().reduce((obj, field) => {
      obj[field.name] = field.value
      return obj
    }, {})
    const newWs = setFields(
      {
        hostPort: host,
        name,
      },
      lake
    )

    try {
      ctlRef.current = new AbortController()
      const [cancelled, error] = await dispatch(
        buildAndAuthenticateLake(newWs, ctlRef.current.signal)
      )
      setIsSubmitting(false)

      if (error) {
        setErrors([error])
        return
      }
      setErrors([])

      // user elected to cancel at dialog or mid-login
      if (cancelled) return

      // success
      onClose()
    } catch (e) {
      console.error(e)
      setIsSubmitting(false)
      setErrors([{message: "Failed to add lake"}])
    }
  }

  function keyUp(e) {
    if (e.key === "Enter") {
      e.stopPropagation()
      e.preventDefault()
      onSave()
    }
  }

  useEventListener(document, "keyup", keyUp, [formRef])

  const defaultName = (lake && lake.name) || ""
  const getDefaultHost = () => {
    if (lake) {
      return lake.port ? [lake.host, lake.port].join(":") : lake.host
    }

    return ""
  }

  return (
    <>
      {errors.length > 0 && (
        <Errors>
          {errors.map(({label, message, input, cause}, i) => {
            const maybePadded = label && input ? " " : ""
            cause && console.error(cause)
            return (
              <li key={i}>
                {maybePadded && <a onClick={() => input.focus()}>{label}</a>}
                {maybePadded + message}
              </li>
            )
          })}
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
              defaultValue={getDefaultHost()}
              disabled={isSubmitting}
            />
          </InputField>
        </form>
      </SignInForm>
      <StyledFooter>
        <SubmitButton disabled={isSubmitting} onClick={onSave}>
          {isSubmitting ? "Conecting..." : isNewLake ? "Connect" : "Save"}
        </SubmitButton>
        <InputButton onClick={isSubmitting ? onCancel : onClickClose}>
          {isSubmitting ? "Cancel" : "Close"}
        </InputButton>
      </StyledFooter>
    </>
  )
}

export default LakeForm
