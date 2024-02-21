import React, {useCallback, useState} from "react"
import form, {FormConfig} from "src/js/models/form"
import {FormErrors} from "./form-errors"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import {Form} from "./form"
import forms from "src/components/forms.module.css"
import classNames from "classnames"
import styles from "./index.module.css"
import {H1} from "src/components/h1"
import {useFields} from "./use-fields"
import {objectIsEmpty} from "src/util/object-is-empty"
import {PopoverModal, usePopoverModal} from "src/components/popover-modal"

export function SettingsModal() {
  const fields = useFields()
  if (objectIsEmpty(fields)) return null
  return <Content fields={fields} />
}

function Content(props: {fields: FormConfig}) {
  const modal = usePopoverModal()
  const [formEl, setForm] = useCallbackRef<HTMLFormElement>()
  const [errors, setErrors] = useState([])

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (!formEl) return
      const f = form(formEl, props.fields)

      if (await f.isValid()) {
        setErrors([])
        f.submit()
        modal.close()
      } else {
        setErrors(f.getErrors())
      }
    },
    [formEl, props.fields]
  )

  return (
    <PopoverModal ref={modal.ref} style={{maxWidth: "75ch"}}>
      <div className="box-s">
        <FormErrors errors={errors} />
        <form
          ref={setForm}
          onSubmit={onSubmit}
          className={classNames(forms.form)}
        >
          <div className="stack-3">
            <H1 className={classNames(forms.title, styles.title)}>Settings</H1>
            <div className={forms.horizontalFields}>
              <Form configs={props.fields} />
            </div>
            <div className={forms.submission}>
              <button
                type="button"
                onClick={modal.close}
                className={forms.button}
              >
                Cancel
              </button>
              <button type="submit" className={forms.submit}>
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </PopoverModal>
  )
}
