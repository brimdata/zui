import {useDispatch, useSelector, useStore} from "react-redux"
import React, {HTMLProps} from "react"
import HistoryButtons from "../common/HistoryButtons"
import LogDetails from "../../state/LogDetails"
import DetailPane from "src/app/detail/Pane"
import classNames from "classnames"

type Pass = HTMLProps<any>

const PaneHeader = (props: Pass) => (
  <header {...props} className="pane-header" />
)

const Left = ({className, ...props}: Pass) => (
  <div {...props} className={classNames("left", className)} />
)
export default function LogDetailsWindow() {
  const dispatch = useDispatch()
  const prevExists = useSelector(LogDetails.getHistory).canGoBack()
  const nextExists = useSelector(LogDetails.getHistory).canGoForward()

  return (
    <div className="log-detail-window">
      <PaneHeader>
        <Left>
          <HistoryButtons
            prevExists={prevExists}
            nextExists={nextExists}
            backFunc={() => dispatch(LogDetails.back())}
            forwardFunc={() => dispatch(LogDetails.forward())}
          />
        </Left>
      </PaneHeader>
      <DetailPane />
    </div>
  )
}
