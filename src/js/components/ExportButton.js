/* @flow */
import {useDispatch} from "react-redux"
import React, {useState} from "react"
import styled from "styled-components"

import {ipcRenderer} from "electron"

import {toolbarExportButton} from "../test/locators"
import ExportIcon from "../icons/ExportIcon"
import InfoNotice from "./InfoNotice"
import MacSpinner from "./MacSpinner"
import ToolbarButton from "./ToolbarButton"
import XButton from "./XButton"
import exportResults from "../flows/exportResults"
import useIpcListener from "./hooks/useIpcListener"
import useSetTimeout from "./hooks/useSetTimeout"

const SpinnerWrap = styled.div`
  transform: scale(0.8);
  margin-right: 12px;
`

const ExportingMessage = () => (
  <>
    <p>Exporting...</p>
    <SpinnerWrap>
      <MacSpinner light />
    </SpinnerWrap>
  </>
)

const DoneMessage = ({onClick}) => (
  <>
    <p>Export complete.</p>
    <XButton onClick={onClick} />
  </>
)

function showDialog() {
  return ipcRenderer.invoke("windows:showSaveDialog", {
    title: "Export Results as ZNG",
    buttonLabel: "Export",
    defaultPath: "results.zng",
    properties: ["createDirectory"]
  })
}

export default function ExportButton() {
  let dispatch = useDispatch()
  let [status, setStatus] = useState("INIT")
  let setTimeout = useSetTimeout()

  useIpcListener("exportResults", onClick, [])

  function dismiss() {
    setStatus("INIT")
  }

  async function onClick() {
    let {canceled, filePath} = await showDialog()
    if (canceled) return
    setStatus("EXPORTING")
    await dispatch(exportResults(filePath))
    setStatus("DONE")
    setTimeout(dismiss, 3000)
  }

  let messages = {
    INIT: null,
    EXPORTING: <ExportingMessage />,
    DONE: <DoneMessage onClick={dismiss} />
  }

  return (
    <div title="Export search results to ZNG file">
      <ToolbarButton
        {...toolbarExportButton.props}
        icon={<ExportIcon />}
        onClick={onClick}
      />
      <label>Export</label>

      {status !== "INIT" && <InfoNotice>{messages[status]}</InfoNotice>}
    </div>
  )
}
