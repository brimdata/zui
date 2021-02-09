import React from "react"
import {useSelector} from "react-redux"
import Feature from "src/js/state/Feature"
import Layout from "src/js/state/Layout"
import {ActionButtonProps} from "./action-button"
import useColumns from "./hooks/useColumns"
import useExport from "./hooks/useExport"
import usePackets from "./hooks/usePackets"
import useView from "./hooks/useView"
import ResponsiveActions from "./responsive-actions"

export default function Actions() {
  const mainView = useSelector(Layout.getMainView)
  const showSummary = useSelector(Feature.show("summary"))
  const view = useView()
  const packets = usePackets()
  const exportAction = useExport()
  const columns = useColumns()

  const actions: ActionButtonProps[] =
    !showSummary || mainView === "search"
      ? [packets, exportAction, columns, view]
      : [view]

  return <ResponsiveActions actions={actions} mainView={mainView} />
}
