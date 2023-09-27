// @refresh reset

import {useSelector} from "react-redux"

import styles from "./index.module.css"
import * as _ from "lodash"
import LoadDataForm from "src/js/state/LoadDataForm"
import {useFilesDrop} from "src/util/hooks/use-files-drop"
import {useDispatch} from "src/app/core/state"
import {useCallback, useEffect} from "react"
import {ResultsControl, useResultsControl} from "./results"
import modal from "src/components/modals.module.css"
import {Shaper} from "./shaper"
import {Sidebar} from "./sidebar"
import {ResultsGroup} from "./results-group"
import useSelect from "src/app/core/hooks/use-select"
import {Debut, useDebut} from "src/components/debut"
import {Dialog} from "src/components/dialog/dialog"
import {ErrorWell} from "src/components/error-well"
import {errorToString} from "src/util/error-to-string"

export function LoadPane() {
  const dispatch = useDispatch()
  const show = useSelector(LoadDataForm.getShow)

  const hide = () => {
    dispatch(LoadDataForm.setShow(false))
  }

  if (!show) return null
  else return <Pane onClose={hide} />
}

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
  const dispatch = useDispatch()
  const [_props, ref] = useFilesDrop({
    onDrop: (files: File[]) =>
      dispatch(LoadDataForm.addFiles(files.map((f) => f.path))),
  })

  return (
    <div className={styles.grid} ref={ref} style={gridStyle}>
      {props.children}
    </div>
  )
}

function Pane(props: {onClose: any}) {
  const select = useSelect()
  const debut = useDebut({afterExit: props.onClose})
  const files = useSelector(LoadDataForm.getFiles)
  const format = useSelector(LoadDataForm.getFormat)
  const original = useResultsControl(files, format, "original")
  const preview = useResultsControl(files, format, "preview")

  const initialize = () => {
    const script = select(LoadDataForm.getShaper)
    const abortOriginal = original.queryAll("*")
    const abortPreview = preview.queryAll(script)

    return () => {
      abortOriginal()
      abortPreview()
    }
  }
  useEffect(initialize, [files, format])

  const onSubmit = useCallback(() => {
    const script = select(LoadDataForm.getShaper)
    preview.queryAll(script)
  }, [files, format])

  return (
    <Debut {...debut.props} classNames="modal">
      <Dialog
        aria-label="preview-load"
        onClose={() => debut.exit()}
        dialogPoint="center center"
        isOpen={true}
        className={modal.modal}
        modal
      >
        <Grid>
          <Main original={original} preview={preview} onSubmit={onSubmit} />
          <Sidebar
            onClose={debut.exit}
            isValid={!original.error && !preview.error}
          />
        </Grid>
      </Dialog>
    </Debut>
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
