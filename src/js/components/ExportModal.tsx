import React, {ChangeEvent, useState} from "react"
import styled from "styled-components"
import {
  ButtonGroup,
  Content,
  Footer,
  SmallTitle
} from "./ModalDialog/ModalDialog"
import ToolbarButton from "./Toolbar/Button"
import MacSpinner from "./MacSpinner"
import exportResults from "../flows/exportResults"
import {popNotice} from "./PopNotice"
import {ipcRenderer} from "electron"
import {useDispatch, useSelector} from "react-redux"
import {SearchFormat} from "../../../zealot"
import InputLabel from "./common/forms/InputLabel"
import Columns from "../state/Columns"
import BrimTooltip from "./BrimTooltip"
import {defaultModalButton} from "../test/locators"

const RadioButtons = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto 24px;

  ${InputLabel} {
    margin-bottom: 6px;
  }
`

const RadioItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 3px;

  input {
    margin: 0 6px 0 0;
  }
`

const StyledTooltip = styled.div`
  width: 120px;
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
  const [isExporting, setIsExporting] = useState(false)
  const [format, setFormat] = useState("zng")
  const columns = useSelector(Columns.getCurrentTableColumns)
  const isUniform = columns.id !== "temp" && columns.id !== "none"

  const onExport = async () => {
    const {canceled, filePath} = await showDialog(format)
    if (canceled) return
    setIsExporting(true)
    await dispatch(exportResults(filePath, format as SearchFormat))
    setIsExporting(false)
    popNotice("Export Complete.")
    onClose()
  }

  return (
    <Content>
      <SmallTitle>Export Search Results</SmallTitle>
      <RadioButtons
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setFormat(e.target.value)
        }}
      >
        <InputLabel>Format</InputLabel>
        <RadioItem>
          <input type="radio" value="zng" name="format" defaultChecked />
          ZNG
        </RadioItem>
        <RadioItem
          data-tip="csv-export-description"
          data-place="right"
          data-effect="solid"
          data-delay-show={500}
        >
          <input disabled={!isUniform} type="radio" value="csv" name="format" />
          CSV
          {!isUniform && (
            <BrimTooltip className="brim-tooltip-show-hover">
              <StyledTooltip>
                CSV export requires uniform records but different types were
                encountered in current search results
              </StyledTooltip>
            </BrimTooltip>
          )}
        </RadioItem>
        <RadioItem>
          <input type="radio" value="ndjson" name="format" />
          NDJSON
        </RadioItem>
      </RadioButtons>
      <Footer>
        <ButtonGroup>
          <ToolbarButton text="Close" onClick={onClose} />
          <ToolbarButton
            {...defaultModalButton.props}
            isPrimary
            text={isExporting ? "" : "Export"}
            icon={isExporting ? <MacSpinner light /> : null}
            disabled={isExporting}
            onClick={onExport}
          />
        </ButtonGroup>
      </Footer>
    </Content>
  )
}

export default ExportModal
