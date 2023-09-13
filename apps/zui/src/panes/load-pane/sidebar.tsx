import {useRef} from "react"
import {useDispatch} from "react-redux"
import useSelect from "src/app/core/hooks/use-select"
import DragAnchor from "src/components/drag-anchor"
import LoadDataForm from "src/js/state/LoadDataForm"
import styles from "./sidebar.module.css"
import {Form} from "./form"

function useSidebarDrag() {
  const start = useRef(0)
  const select = useSelect()
  const dispatch = useDispatch()
  const set = LoadDataForm.setSidebarSize
  const get = LoadDataForm.getSidebarSize
  const ref = useRef<HTMLElement>()

  const onStart = () => {
    start.current = select(get)
  }
  const onDrag = (e, {dx}) => {
    dispatch(set(start.current - dx))
  }
  const onEnd = () => {
    const el = ref.current
    if (!el) return
    dispatch(set(el.getBoundingClientRect().width))
  }

  return {anchorProps: {onStart, onDrag, onEnd}, ref}
}

export function Sidebar(props: {onClose}) {
  const sidebarDrag = useSidebarDrag()
  return (
    <aside className={styles.aside} ref={sidebarDrag.ref}>
      <header>
        <h2 className={styles.formTitle}>
          Preview & Load
          <hr />
        </h2>
      </header>
      <Form onClose={props.onClose} />
      <DragAnchor
        position="left"
        {...sidebarDrag.anchorProps}
        showOnHover
        style={{left: 0}}
      />
    </aside>
  )
}
