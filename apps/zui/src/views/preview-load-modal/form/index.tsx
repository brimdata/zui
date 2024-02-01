import baseForm from "src/components/forms.module.css"
import {ScrollShadow} from "../scroll-shadow"
import {Icon} from "src/components/icon"
import classNames from "classnames"
import styles from "./form.module.css"
import forms from "src/components/forms.module.css"
import {useRef} from "react"
import {IconButton} from "src/components/icon-button"
import {DataFormatOptions} from "src/components/data-format-select"
import {ErrorWell} from "src/components/error-well"
import {basename} from "src/util/basename"
import {Show} from "src/components/show"
import {PoolForm} from "../../pool-form"
import {LoadFormController} from "./controller"
import {useLoadFormState} from "./state"
import {LoadFormat} from "@brimdata/zed-js"

export type LoadFormProps = Parameters<typeof Form>[0]

export function Form(props: {
  onClose: () => any
  onCancel: () => any
  isValid: boolean
}) {
  const state = useLoadFormState()
  const ctl = new LoadFormController(props, state)
  const fileInput = useRef(null)

  return (
    <form
      onSubmit={(e) => ctl.onSubmit(e)}
      className={classNames(styles.form, baseForm.form)}
    >
      <ScrollShadow threshold={45} className={styles.formBody}>
        <section className="stack-1">
          <p>
            Data will be loaded into{" "}
            <b title={state.lake.getAddress()}>{state.lake.name}</b>.
          </p>
          <div className="field">
            <div className={baseForm.actionLabel}>
              <label>Files</label>
              <a onClick={() => fileInput.current?.click()}>
                + Add
                <input
                  ref={fileInput}
                  type="file"
                  style={{display: "none"}}
                  onChange={(e) => {
                    state.addFiles(
                      Array.from(e.currentTarget.files).map((f) => f.path)
                    )
                  }}
                />
              </a>
            </div>
            <ul className={styles.files}>
              {state.files.map((f: string, i) => (
                <li
                  key={i}
                  className={styles.fileItem}
                  aria-label={basename(f)}
                >
                  <Icon
                    name="doc_plain"
                    size={"16px"}
                    fill="var(--primary-color)"
                  />
                  <span title={f} className={styles.fileName}>
                    {basename(f)}
                  </span>
                  <IconButton
                    iconName="close"
                    onClick={() => {
                      state.setFiles(state.files.filter((p) => p !== f))
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="field">
            <label htmlFor="format">Data Format</label>
            <select
              id="format"
              name="format"
              onChange={(e) =>
                state.setFormat(e.currentTarget.value as LoadFormat)
              }
              defaultValue={state.format}
            >
              <DataFormatOptions />
            </select>
          </div>
          <div className="field">
            <label htmlFor="poolId">Pool</label>
            <select
              name="poolId"
              value={state.poolId}
              id="poolId"
              onChange={(e) => state.setPoolId(e.currentTarget.value)}
            >
              <option value="new">+ New Pool</option>
              {state.pools.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {pool.name}
                </option>
              ))}
            </select>
          </div>

          <Show when={state.newPool}>
            <PoolForm />
          </Show>
          <div className="field">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              defaultValue={state.defaultUser}
              name="author"
              id="author"
            />
          </div>
          <div className="field">
            <label htmlFor="body">Message</label>
            <textarea
              name="body"
              id="body"
              defaultValue={state.defaultMessage}
            />
          </div>
        </section>
      </ScrollShadow>
      <div>
        <Show when={state.error}>
          <ErrorWell error={state.error} />
        </Show>

        <div className={classNames(styles.submission)}>
          <button
            type="button"
            onClick={() => {
              props.onCancel()
              props.onClose()
            }}
            className={forms.button}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!props.isValid}
            className={forms.submit}
          >
            Load
          </button>
        </div>
      </div>
    </form>
  )
}
