import {useSelector} from "react-redux"
import LogDetails from "src/js/state/LogDetails"
import {ListView} from "src/zui-kit"
import {EmptyText} from "../right-pane/common"
import {useState} from "react"
import {IconButton} from "src/components/icon-button"
import {openLogDetailsWindow} from "src/js/flows/openLogDetailsWindow"
import {useDispatch} from "src/core/use-dispatch"

export function DetailPane() {
  const value = useSelector(LogDetails.build)
  if (value) {
    return <Detail value={value} />
  } else {
    return <EmptyText>Select a value in the results to view details.</EmptyText>
  }
}

export function Detail({value}) {
  const dispatch = useDispatch()
  const [expanded, setExpanded] = useState({})
  const [page, setPage] = useState({})
  const prevExists = useSelector(LogDetails.getHistory).canGoBack()
  const nextExists = useSelector(LogDetails.getHistory).canGoForward()
  const backFunc = () => dispatch(LogDetails.back())
  const forwardFunc = () => dispatch(LogDetails.forward())
  const onClick = () => dispatch(openLogDetailsWindow(value))

  return (
    <article className="panels direction-column">
      <header className="h-toolbar">
        <nav className="flex gutter">
          <IconButton
            enabled={prevExists}
            onClick={backFunc}
            iconName="left_arrow"
          />
          <IconButton
            onClick={forwardFunc}
            enabled={nextExists}
            iconName="right_arrow"
          />
          <IconButton iconName="external_link" onClick={onClick} />
        </nav>
      </header>
      <section className="principle gutter">
        <ListView
          values={[value]}
          valueExpandedDefaultState={{value: true}}
          valueExpandedState={{value: expanded, onChange: setExpanded}}
          valuePageState={{value: page, onChange: setPage}}
        />
      </section>
    </article>
  )
}
