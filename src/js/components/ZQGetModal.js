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

export default function ZQGetModal() {
  function copyToClip(_, e) {
    clickFeedback(e.target, "Copied")
    var node = document.getElementById("zq-get-code")
    if (node) lib.doc.copyToClipboard(node.textContent)
  }

  return (
    <ModalBox
      buttons={[
        {label: "Copy", click: copyToClip},
        {label: "Done", click: (closeModal) => closeModal()}
      ]}
      name="zq-get"
      className="zq-get-modal"
      title="ZQ Get Command"
      {...reactElementProps("zqGetModal")}
    >
      <ZQDGetModalContents />
    </ModalBox>
  )
}

function ZQDGetModalContents() {
  let program = useSelector(SearchBar.getSearchProgram)
  const bzng = join(useSelector(Tab.spaceName), "all.bzng")

  const cmd = ["zq", "-f table", `"${program}"`, bzng].join(" ")

  return (
    <TextContent>
      <pre id="zq-get-code">{cmd}</pre>
    </TextContent>
  )
}
