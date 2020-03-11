/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {inspectSearch} from "../services/boom"
import {reactElementProps} from "../test/integration"
import ModalBox from "./ModalBox/ModalBox"
import SearchBar from "../state/SearchBar"
import TextContent from "./TextContent"
import clickFeedback from "./clickFeedback"
import lib from "../lib"

export default function CurlModalBox() {
  function copyToClip(_, e) {
    clickFeedback(e.target, "Copied")

    var node = document.getElementById("copy-to-curl-code")
    if (node) lib.doc.copyToClipboard(node.textContent)
  }

  let buttons = [
    {
      label: "Copy",
      click: copyToClip
    },
    {
      label: "Done",
      click: (closeModal) => closeModal()
    }
  ]

  return (
    <ModalBox
      buttons={buttons}
      name="curl"
      className="curl-modal"
      title="curl command"
      {...reactElementProps("curlModal")}
    >
      <CurlModalContents />
    </ModalBox>
  )
}

function CurlModalContents() {
  let dispatch = useDispatch()
  let program = useSelector(SearchBar.getSearchProgram)
  let info = dispatch(inspectSearch(program))

  return (
    <TextContent>
      {info && (
        <pre id="copy-to-curl-code" {...reactElementProps("curlCommand")}>
          curl -X {info.method} -d &apos;
          {JSON.stringify(info.body, null, 2)}
          &apos; {info.url}
        </pre>
      )}
      {!info && (
        <pre id="copy-to-curl-code" {...reactElementProps("curlCommand")}>
          Invalid ZQL: &apos;{program}&apos;
        </pre>
      )}
    </TextContent>
  )
}
