import DragAnchor from "src/components/drag-anchor"
import {Results, ResultsControl} from "./results"
import styles from "./results-group.module.css"
import {useDispatch, useSelector} from "react-redux"
import LoadDataForm from "src/js/state/LoadDataForm"
import {memo, useRef} from "react"
import {bounded} from "src/util/bounded"

function useResultsDrag() {
  const ref = useRef<HTMLElement>()
  const dispatch = useDispatch()
  const total = useRef(0)
  const left = useRef(0)

  const onStart = () => {
    const el = ref.current
    if (!el) return
    total.current = el.getBoundingClientRect().width
    left.current = el.children[0].getBoundingClientRect().width
  }

  const onDrag = (e, {dx}) => {
    const leftSize = left.current + dx
    const ratio = bounded(leftSize / total.current, [0.2, 0.8])

    dispatch(LoadDataForm.setResultsRatio(ratio))
  }

  return {anchorProps: {onStart, onDrag}, ref}
}

export const ResultsGroup = memo(function ResultsGroup(props: {
  original: ResultsControl
  preview: ResultsControl
}) {
  const resultsStyle = useSelector(LoadDataForm.getResultsStyle)
  const resultsDrag = useResultsDrag()

  return (
    <section
      className={styles.resultsGroup}
      ref={resultsDrag.ref}
      style={resultsStyle}
    >
      <div className={styles.resultsContainer}>
        <Results
          className={styles.original}
          title="Original"
          {...props.original}
        />
        <DragAnchor
          position="right"
          showOnHover
          {...resultsDrag.anchorProps}
          style={{right: -8}}
        />
      </div>
      <div className={styles.resultsContainer}>
        <Results className={styles.shaped} title="Preview" {...props.preview} />
      </div>
    </section>
  )
})
