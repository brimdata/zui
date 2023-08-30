import baseForm from "src/components/forms.module.css"
import {ScrollShadow} from "./scroll-shadow"
import Icon from "src/app/core/icon-temp"
import Current from "src/js/state/Current"
import {useForm} from "react-hook-form"
import {useSelector} from "react-redux"
import {invoke} from "src/core/invoke"
import {useDispatch} from "src/app/core/state"
import LoadDataForm from "src/js/state/LoadDataForm"
import useSelect from "src/app/core/hooks/use-select"
import classNames from "classnames"
import styles from "./form.module.css"
import {ChangeEvent, useRef} from "react"
import {IconButton} from "src/components/icon-button"
import {DataFormatOptions} from "src/components/data-format-select"
import {LoadFormat} from "@brimdata/zed-js"

export function Form() {
  const dispatch = useDispatch()
  const select = useSelect()
  const pools = useSelector(Current.getPools)
  const lake = useSelector(Current.getLake)
  const files = useSelector(LoadDataForm.getFiles)
  const fileInput = useRef(null)
  const defaultUser = globalThis.appMeta.userName
  const {register, handleSubmit, watch} = useForm()

  const onSubmit = async (data) => {
    const shaper = select(LoadDataForm.getShaper)
    await invoke("loaders.formAction", {...data, files, shaper})
    dispatch(LoadDataForm.setFiles([]))
  }

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const paths = Array.from(e.currentTarget.files).map((f) => f.path)
    dispatch(LoadDataForm.addFiles(paths))
  }

  const onFormatChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(LoadDataForm.setFormat(e.currentTarget.value as LoadFormat))
  }

  function removeFile(path: string) {
    dispatch(LoadDataForm.setFiles(files.filter((p) => p !== path)))
  }

  function clearFiles() {
    dispatch(LoadDataForm.setFiles([]))
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={classNames(styles.form, baseForm.form)}
    >
      <ScrollShadow threshold={45} className={styles.formBody}>
        <section className={styles.well}>
          <p>
            Data will load into <b title={lake.getAddress()}>{lake.name}</b>.
          </p>
          <p>
            Use the shaper script to transform the data before it is loaded.
          </p>
        </section>
        <section className={styles.fields}>
          <div>
            <div className={baseForm.actionLabel}>
              <label>Files</label>
              <a onClick={() => fileInput.current?.click()}>
                + Add
                <input
                  ref={fileInput}
                  type="file"
                  style={{display: "none"}}
                  onChange={onFileInputChange}
                />
              </a>
            </div>
            <ul className={styles.files}>
              {files.map((f: string, i) => (
                <li key={i} className={styles.fileItem}>
                  <Icon
                    name="doc-plain"
                    size={16}
                    fill="var(--primary-color)"
                  />
                  <span title={f} className={styles.fileName}>
                    {f.split(/[\\/]/).pop()}
                  </span>
                  <IconButton iconName="close" onClick={() => removeFile(f)} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <label>Data Format</label>
            <select {...register("format")} onChange={onFormatChange}>
              <DataFormatOptions />
            </select>
          </div>
          <div>
            <label>Pool</label>
            <select {...register("poolId")}>
              <option value="new">+ New Pool</option>
              {pools.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {pool.name}
                </option>
              ))}
            </select>
          </div>
        </section>
        {watch("poolId") === "new" && (
          <details>
            <summary>
              <div className={styles.summaryRule}>
                <label>Pool Settings</label>
                <hr />
              </div>
            </summary>
            <section className={styles.fields}>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Derive from filenames..."
                />
              </div>
              <div>
                <label>Pool Key</label>
                <input type="text" {...register("key")} defaultValue={"ts"} />
              </div>
              <div>
                <label>Sort Order</label>
                <div className={baseForm.radioInput}>
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
                <div className={baseForm.radioInput}>
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
            </section>
          </details>
        )}
        <details>
          <summary>
            <div className={styles.summaryRule}>
              <label>Commit Settings</label>
              <hr />
            </div>
          </summary>
          <section className={styles.fields}>
            <div>
              <label>Author</label>
              <input
                type="text"
                defaultValue={defaultUser}
                {...register("author")}
              />
            </div>
            <div>
              <label>Message</label>
              <textarea {...register("body")} defaultValue="Import from Zui" />
            </div>
          </section>
        </details>
      </ScrollShadow>
      <div className={classNames(styles.submission)}>
        <button type="button" onClick={() => clearFiles()}>
          Cancel
        </button>
        <button type="submit">Load</button>
      </div>
    </form>
  )
}
