import {Icon} from "src/components/icon"
import styles from "./form.module.css"
import {useRef} from "react"
import {IconButton} from "src/components/icon-button"
import {DataFormatOptions} from "src/components/data-format-select"
import {ErrorWell} from "src/components/error-well"
import {basename} from "src/util/basename"
import {Show} from "src/components/show"
import {PoolForm} from "../../pool-form"
import {LoadFormController} from "./controller"
import {useLoadFormState} from "./state"
import {LoadFormat} from "../../../../../../packages/superdb-types/dist"

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
      style={{display: "grid", gridTemplateRows: "minmax(0, 1fr) auto"}}
      className="overflow-hidden"
    >
      <section className="flow box scroll-y scroll-shadow">
        <p>
          Data will be loaded into{" "}
          <b title={state.lake.getAddress()}>{state.lake.name}</b>.
        </p>
        <label className="repel">
          Files{" "}
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
        </label>
        <ul className="input">
          {state.files.map((f: string, i) => (
            <li key={i} className={styles.fileItem} aria-label={basename(f)}>
              <Icon name="doc_plain" fill="var(--primary-color)" />
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
          {state.files.length == 0 && "No files chosen"}
        </ul>
        <label htmlFor="format">Data Format</label>
        <select
          id="format"
          name="format"
          onChange={(e) => state.setFormat(e.currentTarget.value as LoadFormat)}
          defaultValue={state.format}
        >
          <DataFormatOptions />
        </select>
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

        <Show when={state.newPool}>
          <PoolForm
            nameInput={{
              placeholder: "Defaults to name of file(s)",
            }}
            keyInput={{
              placeholder: "Defaults to 'ts'",
            }}
          />
        </Show>
        <label htmlFor="author">Author</label>
        <input
          type="text"
          defaultValue={state.defaultUser}
          name="author"
          id="author"
        />
        <label htmlFor="body">Message</label>
        <textarea name="body" id="body" defaultValue={state.defaultMessage} />
      </section>

      <div className="box">
        <Show when={state.error}>
          <ErrorWell error={state.error} />
        </Show>

        <footer className="repel">
          <button
            type="button"
            onClick={() => {
              props.onCancel()
              props.onClose()
            }}
            className="button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!props.isValid}
            className="button submit"
          >
            Load
          </button>
        </footer>
      </div>
    </form>
  )
}
