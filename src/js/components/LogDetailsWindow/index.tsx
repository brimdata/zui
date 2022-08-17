import {useDispatch, useSelector} from "react-redux"
import React, {HTMLProps} from "react"
import useStoreExport from "src/app/core/hooks/useStoreExport"
import HistoryButtons from "../common/HistoryButtons"
import LogDetails from "../../state/LogDetails"
import DetailPane from "src/app/detail/Pane"
import ActionButton from "src/app/query-home/toolbar/actions/action-button"
import usePluginToolbarItems from "src/app/query-home/toolbar/hooks/use-plugin-toolbar-items"
import classNames from "classnames"

type Pass = HTMLProps<any>

const PaneHeader = (props: Pass) => (
  <header {...props} className="pane-header" />
)

const Left = ({className, ...props}: Pass) => (
  <div {...props} className={classNames("left", className)} />
)
const Right = ({className, ...props}: Pass) => (
  <div {...props} className={classNames("right", className)} />
)

export default function LogDetailsWindow() {
  useStoreExport()
  const dispatch = useDispatch()
  const prevExists = useSelector(LogDetails.getHistory).canGoBack()
  const nextExists = useSelector(LogDetails.getHistory).canGoForward()
  const pluginButtons = usePluginToolbarItems("detail").map((button, i) => (
    <ActionButton key={button.label || i} {...button} />
  ))

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
        <Right>
          <div>{pluginButtons}</div>
        </Right>
      </PaneHeader>
      <DetailPane />
    </div>
  )
}
