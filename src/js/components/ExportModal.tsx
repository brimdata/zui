import {ipcRenderer} from "electron"
import React, {ChangeEvent, useState} from "react"
import {toast} from "react-hot-toast"
import {useDispatch} from "react-redux"
import styled from "styled-components"
import ToolbarButton from "../../../app/toolbar/button"
import {defaultModalButton} from "../../../test/playwright/helpers/locators"
import {QueryFormat} from "../../../zealot-old"
import exportResults from "../flows/exportResults"
import {AppDispatch} from "../state/types"
import InputLabel from "./common/forms/InputLabel"
import {
  ButtonGroup,
  Content,
  Footer,
  SmallTitle
} from "./ModalDialog/ModalDialog"

const RadioButtons = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  cursor: default;
`

const RadioItem = styled.div<{isDisabled?: boolean}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 3px;
  margin-left: 8px;

  input {
    margin: 0 6px 0 0;
  }
`

const FormatContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: 0 12px 24px;
`

const StyledFooter = styled(Footer)`
  background: transparent;
  margin: 0 12px 12px 12px;
  padding: 0;
`

const showDialog = (format) => {
  return ipcRenderer.invoke("windows:showSaveDialog", {
    title: `Export Results as ${format.toUpperCase()}`,
    buttonLabel: "Export",
    defaultPath: `results.${format}`,
    properties: ["createDirectory"],
    showsTagField: false
  })
}

const ExportModal = ({onClose}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [format, setFormat] = useState("zng")

  const onExport = async () => {
    const {canceled, filePath} = await showDialog(format)
    if (canceled) return

    toast.promise(dispatch(exportResults(filePath, format as QueryFormat)), {
      loading: "Exporting...",
      success: "Export Complete",
      error: "Error Exporting"
    })

    onClose()
  }

  return (
    <Content width={330}>
      <SmallTitle>Export Results</SmallTitle>
      <FormatContent>
        <InputLabel>Format</InputLabel>
        <RadioButtons
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setFormat(e.target.value)
          }}
        >
          <RadioItem>
            <input
              type="radio"
              id="zng"
              value="zng"
              name="format"
              defaultChecked
            />
            <label htmlFor="zng">zng</label>
          </RadioItem>
          <RadioItem>
            <input type="radio" id="ndjson" value="ndjson" name="format" />
            <label htmlFor="ndjson">ndjson</label>
          </RadioItem>
          <RadioItem>
            <input type="radio" id="csv" value="csv" name="format" />
            <label htmlFor="csv">csv</label>
          </RadioItem>
        </RadioButtons>
      </FormatContent>
      <StyledFooter>
        <ButtonGroup>
          <ToolbarButton text="Close" onClick={onClose} />
          <ToolbarButton
            {...defaultModalButton.props}
            isPrimary
            text={"Export"}
            onClick={onExport}
          />
        </ButtonGroup>
      </StyledFooter>
    </Content>
  )
}

export default ExportModal
