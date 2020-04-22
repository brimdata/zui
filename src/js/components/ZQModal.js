/* @flow */

import {useSelector} from "react-redux"
import React from "react"
import {join} from "path"

import {reactElementProps} from "../test/integration"
import ModalBox from "./ModalBox/ModalBox"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import TextContent from "./TextContent"
import clickFeedback from "./clickFeedback"
import lib from "../lib"

export default function ZQModal() {
  function copyToClip(_, e) {
    clickFeedback(e.target, "Copied")
    var node = document.getElementById("zq-code")
    if (node) lib.doc.copyToClipboard(node.textContent)
  }

  return (
    <ModalBox
      buttons={[
        {label: "Copy", click: copyToClip},
        {label: "Done", click: (closeModal) => closeModal()}
      ]}
      name="zq"
      className="zq-modal"
      title="zq command"
      {...reactElementProps("zqModal")}
    >
      <ZQModalContents />
    </ModalBox>
  )
}

function ZQModalContents() {
  let program = useSelector(SearchBar.getSearchProgram)
  const zng = join(useSelector(Tab.spaceName), "all.zng")

  const cmd = ["zq", "-f table", `"${program}"`, zng].join(" ")

  return (
    <TextContent>
      <pre id="zq-code">{cmd}</pre>
    </TextContent>
  )
}
