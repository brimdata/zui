import {useSelector} from "react-redux"
import styles from "./load-pane.module.css"
import {ModalRoot} from "src/components/modal-root"
import Current from "src/js/state/Current"
import baseForm from "src/components/forms.module.css"
import classNames from "classnames"
import Icon from "src/app/core/icon-temp"
import {IconButton} from "src/components/icon-button"
import LoadDataForm from "src/js/state/LoadDataForm"
import {useFilesDrop} from "src/util/hooks/use-files-drop"
import {useDispatch} from "src/app/core/state"
import {useRef} from "react"
import {ScrollShadow} from "./scroll-shadow"
import {useForm} from "react-hook-form"
import {invoke} from "src/core/invoke"

export function LoadPane() {
  const files = useSelector(LoadDataForm.getFiles)
  const pools = useSelector(Current.getPools)
  const dispatch = useDispatch()

  const {register, handleSubmit, watch} = useForm()
  const onSubmit = async (data) => {
    await invoke("loaders.formAction", {...data, files})
    clearFiles()
  }

  function addFiles(paths: string[]) {
    dispatch(LoadDataForm.setFiles([...files, ...paths]))
  }

  function removeFile(path: string) {
    dispatch(LoadDataForm.setFiles(files.filter((p) => p !== path)))
  }

  function clearFiles() {
    dispatch(LoadDataForm.setFiles([]))
  }

  const [_props, ref] = useFilesDrop({
    onDrop: (files: File[]) => addFiles(files.map((f) => f.path)),
  })

  const fileInput = useRef(null)

  if (files.length === 0) return null

  return (
    <ModalRoot>
      <div className={styles.grid} ref={ref}>
        <nav>{/* <h1>Preview & load</h1> */}</nav>

        <aside className={styles.aside}>
          <h2 className={styles.formTitle}>
            Load Data
            <hr />
          </h2>
          <form
            className={classNames(styles.form, baseForm.form)}
            onSubmit={handleSubmit(onSubmit)}
          >
            <ScrollShadow threshold={45}>
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
                        onChange={(e) => {
                          addFiles(
                            Array.from(e.currentTarget.files).map((f) => f.path)
                          )
                        }}
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
                          {f}
                        </span>
                        <IconButton
                          iconName="close"
                          onClick={() => removeFile(f)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <label>Pool</label>
                  <select {...register("poolId")}>
                    <option value="default">Select Pool</option>
                    <option value="new">+ Create New</option>
                    {pools.map((pool) => (
                      <option key={pool.id} value={pool.id}>
                        {pool.name}
                      </option>
                    ))}
                  </select>
                  {watch("poolId") === "new" && (
                    <fieldset>
                      <div>
                        <label>Name</label>
                        <input type="text" {...register("name")} />
                      </div>
                      <div>
                        <label>Pool Key</label>
                        <input type="text" {...register("key")} />
                      </div>
                      <div>
                        <label>Sort Order</label>
                        <div className={baseForm.radioInput}>
                          <input
                            id="ascending"
                            name="order"
                            type="radio"
                            value="asc"
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
                    </fieldset>
                  )}
                </div>
                <div>
                  <label>Author</label>
                  <input type="text" />
                </div>
                <div>
                  <label>Message</label>
                  <textarea></textarea>
                </div>
              </section>
            </ScrollShadow>
            <div className={classNames(styles.submission)}>
              <a className={baseForm.cancel} onClick={() => clearFiles()}>
                Cancel
              </a>
              <button type="submit">Load</button>
            </div>
          </form>
        </aside>
        <main></main>
      </div>
    </ModalRoot>
  )
}
