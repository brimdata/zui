import {useForm} from "react-hook-form"
import forms from "src/components/forms.module.css"
import styles from "./index.module.css"
import classNames from "classnames"
import {H1} from "src/components/h1"
import {useZuiApi} from "src/app/core/context"
import {lakePoolPath} from "src/app/router/utils/paths"
import Tabs from "src/js/state/Tabs"
import {useDispatch} from "src/app/core/state"
import {useState} from "react"
import {formatError} from "./format-error"

export function NewPoolModal(props) {
  const {register, handleSubmit} = useForm()
  const api = useZuiApi()
  const dispatch = useDispatch()
  const [error, setError] = useState("")
  const onSubmit = handleSubmit(async (data) => {
    try {
      const id = await api.pools.create(data.name, data)
      dispatch(Tabs.activateUrl(lakePoolPath(id)))
      api.toast.success("Pool Created")
      props.onClose()
    } catch (e) {
      setError(e)
    }
  })

  return (
    <form className={classNames(forms.form, styles.form)} onSubmit={onSubmit}>
      <H1 className={styles.title}>New Pool</H1>
      <section className={styles.fields}>
        <div>
          <label>Name</label>
          <input type="text" {...register("name")} autoFocus required />
        </div>
        <div>
          <label>Pool Key</label>
          <input
            type="text"
            {...register("key")}
            defaultValue={"ts"}
            required
          />
        </div>
        <div>
          <label>Sort Order</label>
          <div className={forms.radioInput}>
            <input
              id="ascending"
              name="order"
              type="radio"
              value="asc"
              defaultChecked
              {...register("order")}
            />
            <label htmlFor="ascending">Ascending</label>
          </div>
          <div className={forms.radioInput}>
            <input
              id="descending"
              name="order"
              type="radio"
              value="desc"
              {...register("order")}
            />
            <label htmlFor="descending">Descending</label>
          </div>
        </div>
        {error && <div className={forms.error}>{formatError(error)}</div>}
        <div className={classNames(forms.submission, styles.submission)}>
          <button type="button" onClick={props.onClose}>
            Cancel
          </button>
          <button type="submit">Create</button>
        </div>
      </section>
    </form>
  )
}
