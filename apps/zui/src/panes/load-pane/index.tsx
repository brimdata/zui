// @refresh reset

import {useSelector} from "react-redux"

import styles from "./index.module.css"
import * as _ from "lodash"
import LoadDataForm from "src/js/state/LoadDataForm"
import {useFilesDrop} from "src/util/hooks/use-files-drop"
import {useDispatch} from "src/app/core/state"
import {useCallback, useEffect} from "react"
import {useResultsControl} from "./results"
import modal from "src/components/modals.module.css"
import {Shaper} from "./shaper"
import {Sidebar} from "./sidebar"
import {ResultsGroup} from "./results-group"
import useSelect from "src/app/core/hooks/use-select"
import {Debut, useDebut} from "src/components/debut"
import {Dialog} from "src/components/dialog/dialog"

export function LoadPane() {
  const dispatch = useDispatch()
  const show = useSelector(LoadDataForm.getShow)

  const hide = () => {
    dispatch(LoadDataForm.setShow(false))
  }

  if (!show) return null
  else return <Pane onClose={hide} />
}

function Main() {
  const files = useSelector(LoadDataForm.getFiles)
  const format = useSelector(LoadDataForm.getFormat)
  const mainStyle = useSelector(LoadDataForm.getMainStyle)
  const original = useResultsControl(files, format)
  const preview = useResultsControl(files, format)
  const select = useSelect()

  const initialize = () => {
    const script = select(LoadDataForm.getShaper)
    original.queryAll(script)
    preview.queryAll(script)
  }

  const submit = useCallback(() => {
    const script = select(LoadDataForm.getShaper)
    preview.queryAll(script)
  }, [files, format])

  useEffect(initialize, [files, format])

  return (
    <main className={styles.main} style={mainStyle}>
      <Shaper onSubmit={submit} />
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
  const debut = useDebut({afterExit: props.onClose})

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
          <Main />
          <Sidebar onClose={debut.exit} />
        </Grid>
      </Dialog>
    </Debut>
  )
}
