import {nanoid} from "@reduxjs/toolkit"
import {isEmpty} from "lodash"
import React, {useEffect, useRef, useState} from "react"
import {useDispatch} from "react-redux"
import form, {FormConfig} from "../../models/form"
import {buildAndAuthenticateLake} from "../../flows/lake/buildAndAuthenticateLake"
import {AppDispatch} from "../../state/types"
import {LakeAttrs} from "../../state/Lakes/types"
import useCallbackRef from "../hooks/useCallbackRef"
import useEventListener from "../hooks/useEventListener"
import {isDefaultLake} from "../../initializers/initLakeParams"
import {Lake} from "src/models/lake"
import {ErrorWell} from "src/components/error-well"

type Props = {
  lake?: Lake
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

  const setFields = ({hostPort, name}, l?: LakeAttrs): Partial<LakeAttrs> => {
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
    <form ref={setFormRef}>
      <div className="flow region region-space-xl">
        <label>{config.name.label}</label>
        <input
          type="text"
          name={config.name.name}
          defaultValue={defaultName}
          disabled={isSubmitting}
          autoFocus
        />
        <label>{config.host.label}</label>
        <input
          type="text"
          name={config.host.name}
          defaultValue={getDefaultHost()}
          disabled={isSubmitting}
        />
      </div>
      <FormErrors errors={errors} />
      <div className="repel">
        <button
          type="button"
          onClick={isSubmitting ? onCancel : onClickClose}
          className="button"
        >
          Close
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={onSave}
          className="button submit"
        >
          {isSubmitting ? "Connecting..." : isNewLake ? "Connect" : "Save"}
        </button>
      </div>
    </form>
  )
}

function FormErrors({errors}: {errors: any[]}) {
  if (errors.length === 0) return null

  return (
    <ErrorWell>
      <ul>
        {errors.map(({label, message, input}, i) => {
          const maybePadded = label && input ? " " : ""
          return (
            <li key={i}>
              {maybePadded && <a onClick={() => input.focus()}>{label}</a>}
              {maybePadded + message}
            </li>
          )
        })}
      </ul>
    </ErrorWell>
  )
}

export default LakeForm
