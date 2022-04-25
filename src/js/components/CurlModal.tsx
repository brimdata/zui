import {useDispatch} from "react-redux"
import React, {useEffect, useState} from "react"

import {inspectSearch} from "../flows/inspectSearch"
import clickFeedback from "./clickFeedback"
import lib from "../lib"
import {AppDispatch} from "../state/types"
import {
  ButtonGroup,
  Content,
  Footer,
  Pre,
  Scrollable,
  Title,
} from "./ModalDialog/ModalDialog"
import ToolbarButton from "src/app/toolbar/button"
import useEnterKey from "./hooks/useEnterKey"

export default function CurlModalBox({onClose}) {
  useEnterKey(onClose)
  const dispatch = useDispatch<AppDispatch>()
  const [curl, setCurl] = useState("")

  useEffect(() => {
    dispatch(inspectSearch()).then((command) => {
      setCurl(command)
    })
  }, [])

  function copyToClip(e) {
    clickFeedback(e.target, "Copied")
    const node = document.getElementById("copy-to-curl-code")
    if (node) lib.doc.copyToClipboard(node.textContent)
  }

  return (
    <Content width={600}>
      <Title>Curl Command</Title>
      <Scrollable>
        <Pre id="copy-to-curl-code">{curl}</Pre>
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
