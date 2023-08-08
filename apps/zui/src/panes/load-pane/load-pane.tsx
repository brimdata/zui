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

export function LoadPane() {
  const files = useSelector(LoadDataForm.getFiles)
  const pools = useSelector(Current.getPools)
  const dispatch = useDispatch()

  function addFiles(paths: string[]) {
    console.log([...files, ...paths])
    dispatch(LoadDataForm.setFiles([...files, ...paths]))
  }

  function removeFile(path: string) {
    dispatch(LoadDataForm.setFiles(files.filter((p) => p !== path)))
  }

  function clearFiles() {
    dispatch(LoadDataForm.setFiles([]))
  }

  const [props, ref] = useFilesDrop({
    onDrop: (files: File[]) => addFiles(files.map((f) => f.path)),
  })

  const fileInput = useRef()

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
          <form className={classNames(styles.form, baseForm.form)}>
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
              <select>
                <option>+ Create new with Defaults</option>
                <option>+ Create new</option>
                {pools.map((pool) => (
                  <option key={pool.id} value={pool.id}>
                    {pool.name}
                  </option>
                ))}
              </select>

              <fieldset>
                <div>
                  <label>Name</label>
                  <input type="text" />
                </div>
                <div>
                  <label>Pool Key</label>
                  <input type="text" />
                </div>
                <div>
                  <label>Sort Order</label>
                  <select>
                    <option>Ascending</option>
                    <option>Descending</option>
                  </select>
                </div>
              </fieldset>
            </div>
            <div>
              <label>Author</label>
              <input type="text" />
            </div>
            <div>
              <label>Message</label>
              <textarea></textarea>
            </div>
            <div className={classNames(styles.submission, baseForm.submission)}>
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
