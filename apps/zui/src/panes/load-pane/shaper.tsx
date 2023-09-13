import {IconButton} from "src/components/icon-button"
import styles from "./shaper.module.css"
import {
  ZedEditor,
  useZedEditorKeyboardSubmit,
} from "src/app/query-home/search-area/zed-editor"
import DragAnchor from "src/components/drag-anchor"
import useSelect from "src/app/core/hooks/use-select"
import {useDispatch} from "src/app/core/state"
import {memo, useRef} from "react"
import LoadDataForm from "src/js/state/LoadDataForm"
import {useSelector} from "react-redux"

function useShaperDrag() {
  const select = useSelect()
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>()
  const size = useRef(0)
  const onStart = () => {
    size.current = select(LoadDataForm.getEditorSize)
  }
  const onDrag = (e, {dy}) => {
    dispatch(LoadDataForm.setEditorSize(size.current + dy))
  }

  const onEnd = () => {
    const el = ref.current
    if (!el) return
    dispatch(LoadDataForm.setEditorSize(el.getBoundingClientRect().height))
  }

  return {anchorProps: {onStart, onDrag, onEnd}, ref}
}

export const Shaper = memo(function Shaper(props: {onSubmit: () => any}) {
  const drag = useShaperDrag()
  const onKeyDown = useZedEditorKeyboardSubmit(props.onSubmit)
  const dispatch = useDispatch()
  const shaper = useSelector(LoadDataForm.getShaper)
  function setShaper(text: string) {
    dispatch(LoadDataForm.setShaper(text))
  }

  return (
    <section className={styles.shaper} ref={drag.ref}>
      <div className={styles.toolbar}>
        <div>
          <h2 className={styles.title}>Shaper Script</h2>
        </div>
        <div className={styles.toolbarActions}>
          <IconButton iconName="run" onClick={props.onSubmit} />
        </div>
      </div>
      <div onKeyDownCapture={onKeyDown} className={styles.editor}>
        <ZedEditor
          path="preview"
          value={shaper}
          onChange={(s) => setShaper(s)}
        />
      </div>
      <DragAnchor
        position="bottom"
        showOnHover
        style={{bottom: -8}}
        {...drag.anchorProps}
      />
    </section>
  )
})
