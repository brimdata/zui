import React, {useCallback, useState} from "react"
import form, {FormConfig} from "src/js/models/form"
import {FormErrors} from "./form-errors"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import {Form} from "./form"
import forms from "src/components/forms.module.css"
import classNames from "classnames"
import {Dialog} from "src/components/dialog/dialog"
import {Debut, useDebut} from "src/components/debut"
import modals from "src/components/modals.module.css"
import styles from "./index.module.css"
import Modal from "src/js/state/Modal"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import {H1} from "src/components/h1"
import {useFields} from "./use-fields"
import {objectIsEmpty} from "src/util/object-is-empty"

export function PreferencesModal() {
  const name = useSelector(Modal.getName)
  if (name !== "settings") return null

  return <ModalWithFields />
}

export function ModalWithFields() {
  const fields = useFields()
  if (objectIsEmpty(fields)) return null
  return <ModalDialog fields={fields} />
}

export function ModalDialog(props: {fields: FormConfig}) {
  const dispatch = useDispatch()
  const [formEl, setForm] = useCallbackRef<HTMLFormElement>()
  const [errors, setErrors] = useState([])
  const debut = useDebut({afterExit: () => dispatch(Modal.hide())})

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (!formEl) return
      const f = form(formEl, props.fields)

      if (await f.isValid()) {
        setErrors([])
        f.submit()
        debut.exit()
      } else {
        setErrors(f.getErrors())
      }
    },
    [formEl, props.fields]
  )

  const onCancel = () => {
    debut.exit()
  }

  return (
    <Debut classNames="modal" {...debut.props}>
      <Dialog
        modal
        isOpen={true}
        onClose={() => debut.exit()}
        className={classNames(styles.modal, modals.modal)}
        dialogPoint="center center"
      >
        <FormErrors errors={errors} />
        <form
          ref={setForm}
          onSubmit={onSubmit}
          className={classNames(forms.form, "settings-form")}
        >
          <H1 className={classNames(forms.title, styles.title)}>Settings</H1>
          <div className={forms.horizontalFields}>
            <Form configs={props.fields} />
          </div>
          <div className={forms.submission}>
            <button type="button" onClick={onCancel} className={forms.button}>
              Cancel
            </button>
            <button type="submit" className={forms.submit}>
              Save
            </button>
          </div>
        </form>
      </Dialog>
    </Debut>
  )
}
