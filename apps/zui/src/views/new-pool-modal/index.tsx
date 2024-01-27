import forms from "src/components/forms.module.css"
import styles from "./index.module.css"
import classNames from "classnames"
import {H1} from "src/components/h1"
import {useState} from "react"
import {formatError} from "./format-error"
import {PoolForm} from "../pool-form"
import {NewPoolModalController} from "./controller"

export function NewPoolModal(props) {
  const [error, setError] = useState("")
  const state = {error, setError}
  const ctl = new NewPoolModalController(props, state)

  return (
    <form
      className={classNames(forms.form, styles.form)}
      onSubmit={(e) => ctl.onSubmit(e)}
    >
      <H1 className={styles.title}>New Pool</H1>
      <section className="stack-1">
        <PoolForm />
        {error && <div className={forms.error}>{formatError(error)}</div>}
        <div className={classNames(forms.submission, styles.submission)}>
          <button
            type="button"
            onClick={props.onClose}
            className={forms.button}
          >
            Cancel
          </button>
          <button type="submit" className={forms.submit}>
            Create
          </button>
        </div>
      </section>
    </form>
  )
}
