// @refresh reset

import {useSelector} from "react-redux"

import styles from "./index.module.css"
import * as _ from "lodash"
import LoadDataForm from "src/js/state/LoadDataForm"
import {useCallback, useEffect, useRef} from "react"
import {ResultsControl, useResultsControl} from "./results"
import {Shaper} from "./shaper"
import {Sidebar} from "./sidebar"
import {ResultsGroup} from "./results-group"
import useSelect from "src/util/hooks/use-select"
import {ErrorWell} from "src/components/error-well"
import {errorToString} from "src/util/error-to-string"
import {call} from "src/util/call"
import {invoke} from "src/core/invoke"
import {FullModal, useFullModal} from "src/components/full-modal"
import {useDispatch} from "src/core/use-dispatch"

function Main(props: {
  original: ResultsControl
  preview: ResultsControl
  onSubmit: () => any
}) {
  const {original, preview, onSubmit} = props
  const mainStyle = useSelector(LoadDataForm.getMainStyle)

  if (original.error)
    return (
      <ErrorWell {...humanizeError(original.error)} className={styles.error} />
    )

  return (
    <main className={styles.main} style={mainStyle}>
      <Shaper onSubmit={onSubmit} />
      <ResultsGroup original={original} preview={preview} />
    </main>
  )
}

function Grid(props: {children: any}) {
  const gridStyle = useSelector(LoadDataForm.getGridStyle)

  return (
    <div className={styles.grid} style={gridStyle}>
      {props.children}
    </div>
  )
}

export function PreviewLoadModal() {
  // Too much in here. We need a ctl
  const select = useSelect()
  const files = useSelector(LoadDataForm.getFiles)
  const format = useSelector(LoadDataForm.getFormat)
  const original = useResultsControl(files, format)
  const preview = useResultsControl(files, format)
  const modal = useFullModal()

  const abortSubmit = useRef(null)
  const cancelSubmit = () => call(abortSubmit.current)
  const onSubmit = useCallback(() => {
    cancelSubmit()
    const script = select(LoadDataForm.getShaper)
    const abort = preview.queryAll(script)
    abortSubmit.current = abort
  }, [files, format])

  const onCancel = () => {
    // Cleanup the tmp files created by paste if you cancel
    const files = select(LoadDataForm.getFiles)
    const poolId = select(LoadDataForm.getPoolId)
    invoke("loads.cancel", poolId, files, "")
  }

  useEffect(() => onSubmit(), [files, format])
  useEffect(() => cancelSubmit, [files, format])
  useEffect(() => {
    const abort = original.queryAll("pass")
    return abort
  }, [files, format])
  const dispatch = useDispatch()

  return (
    <FullModal ref={modal.ref}>
      <Grid>
        <Main original={original} preview={preview} onSubmit={onSubmit} />
        <Sidebar
          onClose={() => {
            dispatch(LoadDataForm.reset())
            modal.close()
          }}
          onCancel={onCancel}
          isValid={!original.error && !preview.error}
        />
      </Grid>
    </FullModal>
  )
}

function humanizeError(e: unknown) {
  const error = errorToString(e)

  if (error.includes("stdio:stdin: format detection error")) {
    return {
      title: "Format Detection Error",
      error: error.replace(
        "stdio:stdin: format detection error",
        "The auto-detector returned these errors for each format attempted:"
      ),
    }
  }

  return {error, title: "Error Reading Data"}
}
