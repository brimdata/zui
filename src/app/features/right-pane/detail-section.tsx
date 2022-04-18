import React from "react"
import DetailPane from "src/app/detail/Pane"
import {useDispatch, useSelector} from "react-redux"
import {openLogDetailsWindow} from "src/js/flows/openLogDetailsWindow"
import ExpandWindow from "src/js/icons/ExpandWindow"
import Current from "src/js/state/Current"
import Layout from "src/js/state/Layout"
import LogDetails from "src/js/state/LogDetails"
import AppErrorBoundary from "src/js/components/AppErrorBoundary"
import CloseButton from "src/js/components/CloseButton"
import HistoryButtons from "src/js/components/common/HistoryButtons"
import Pane, {
  Center,
  Left,
  PaneBody,
  PaneHeader,
  PaneTitle,
  Right
} from "src/js/components/Pane"
import {XRightPaneExpander} from "src/js/components/RightPaneExpander"

const DetailSection = () => {
  const dispatch = useDispatch()
  const isOpen = useSelector(Layout.getDetailPaneIsOpen)
  const width = useSelector(Layout.getDetailPaneWidth)
  const prevExists = useSelector(LogDetails.getHistory).canGoBack()
  const nextExists = useSelector(LogDetails.getHistory).canGoForward()
  const currentLog = useSelector(LogDetails.build)
  const pool = useSelector(Current.getQueryPool)

  const onDrag = (e: MouseEvent) => {
    const width = window.innerWidth - e.clientX
    const max = window.innerWidth
    dispatch(Layout.setDetailPaneWidth(Math.min(width, max)))
  }

  if (!pool) return null
  if (!isOpen) return <XRightPaneExpander />
  return (
    <Pane
      isOpen={isOpen}
      onDrag={onDrag}
      position="right"
      width={width}
      className="log-detail-pane"
      aria-label="details"
    >
      {currentLog && (
        <PaneHeader>
          <Left>
            <HistoryButtons
              prevExists={prevExists}
              nextExists={nextExists}
              backFunc={() => dispatch(LogDetails.back())}
              forwardFunc={() => dispatch(LogDetails.forward())}
            />
          </Left>
          <Center className="log-detail-center">
            <PaneTitle>Log Details</PaneTitle>
            <ExpandWindow
              onClick={() => dispatch(openLogDetailsWindow())}
              className="panel-button"
            />
          </Center>
          <Right>
            <CloseButton
              className="panel-button close-button"
              onClick={() => dispatch(Layout.hideDetailPane())}
            />
          </Right>
        </PaneHeader>
      )}
      <PaneBody>
        <AppErrorBoundary>
          <DetailPane />
        </AppErrorBoundary>
      </PaneBody>
    </Pane>
  )
}

export default DetailSection
