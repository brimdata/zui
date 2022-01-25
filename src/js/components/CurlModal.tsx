import {useDispatch} from "react-redux"
import React from "react"

import {inspectSearch} from "../flows/inspectSearch"
import {reactElementProps} from "../../../test/playwright/helpers/integration"
import clickFeedback from "./clickFeedback"
import lib from "../lib"
import {AppDispatch} from "../state/types"
import {
  ButtonGroup,
  Content,
  Footer,
  Pre,
  Scrollable,
  Title
} from "./ModalDialog/ModalDialog"
import ToolbarButton from "../../../app/toolbar/button"
import useEnterKey from "./hooks/useEnterKey"

export default function CurlModalBox({onClose}) {
  useEnterKey(onClose)
  const dispatch = useDispatch<AppDispatch>()
  const curl = dispatch(inspectSearch())

  function copyToClip(e) {
    clickFeedback(e.target, "Copied")
    const node = document.getElementById("copy-to-curl-code")
    if (node) lib.doc.copyToClipboard(node.textContent)
  }

  return (
    <Content width={600} {...reactElementProps("curlModal")}>
      <Title>Curl Command</Title>
      <Scrollable>
        <Pre id="copy-to-curl-code" {...reactElementProps("curlCommand")}>
          {curl}
        </Pre>
      </Scrollable>
      <Footer>
        <ButtonGroup>
          <ToolbarButton text="Copy" onClick={copyToClip} />
          <ToolbarButton text="Done" onClick={onClose} />
        </ButtonGroup>
      </Footer>
    </Content>
  )
}
