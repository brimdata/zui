import React, {ChangeEvent, useState} from "react"
import styled, {css} from "styled-components"
import {
  ButtonGroup,
  Content,
  Footer,
  SmallTitle
} from "./ModalDialog/ModalDialog"
import ToolbarButton from "./Toolbar/Button"
import exportResults from "../flows/exportResults"
import {popNotice} from "./PopNotice"
import {ipcRenderer} from "electron"
import {useDispatch, useSelector} from "react-redux"
import {SearchFormat} from "../../../zealot"
import InputLabel from "./common/forms/InputLabel"
import Columns from "../state/Columns"
import {defaultModalButton} from "../test/locators"

const RadioButtons = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 12px 24px;
  padding: 0;
  cursor: default;

  ${InputLabel} {
    margin-bottom: 6px;
  }
`

const RadioItem = styled.div<{isDisabled?: boolean}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 3px;
  margin-left: 12px;
  ${(p) =>
    p.isDisabled &&
    css`
      color: var(--slate);
    `}

  input {
    margin: 0 6px 0 0;
  }
`

const StyledFooter = styled(Footer)`
  background: transparent;
`

const StyledInfo = styled.div`
  width: 250px;
  color: var(--red);
`

const showDialog = (format) => {
  return ipcRenderer.invoke("windows:showSaveDialog", {
    title: `Export Results as ${format.toUpperCase()}`,
    buttonLabel: "Export",
    defaultPath: `results.${format}`,
    properties: ["createDirectory"]
  })
}

const ExportModal = ({onClose}) => {
  const dispatch = useDispatch()
  const [format, setFormat] = useState("zng")
  const columns = useSelector(Columns.getCurrentTableColumns)
  const isUniform = columns.id !== "temp" && columns.id !== "none"

  const onExport = async () => {
    const {canceled, filePath} = await showDialog(format)
    if (canceled) return
    onClose()
    await dispatch(exportResults(filePath, format as SearchFormat))
    popNotice("Export Complete.")
  }

  return (
    <Content>
      <SmallTitle>Export Results</SmallTitle>
      <RadioButtons
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setFormat(e.target.value)
        }}
      >
        <InputLabel>Format</InputLabel>
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
        <RadioItem isDisabled={!isUniform}>
          <input
            disabled={!isUniform}
            type="radio"
            id="csv"
            value="csv"
            name="format"
          />
          <label htmlFor="csv">csv</label>
        </RadioItem>
        {!isUniform && (
          <StyledInfo>
            CSV export requires uniform records but different types were
            encountered in current search results.
          </StyledInfo>
        )}
        <RadioItem>
          <input type="radio" id="ndjson" value="ndjson" name="format" />
          <label htmlFor="ndjson">ndjson</label>
        </RadioItem>
      </RadioButtons>
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
