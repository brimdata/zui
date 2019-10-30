/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useState} from "react"

import {InputCheckbox} from "./form/Inputs"
import {getCurrentCluster} from "../state/clusters/selectors"
import {getSearchProgram} from "../state/selectors/searchBar"
import {inspectSearch} from "../backend/thunks"
import Form from "./form/Form"
import ModalBox from "./ModalBox/ModalBox"
import TextContent from "./TextContent"
import clickFeedback from "./clickFeedback"
import lib from "../lib"
import {reactElementProps} from "../test/integration"

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
      title="Curl Command"
      {...reactElementProps("curlModal")}
    >
      <CurlModalContents />
    </ModalBox>
  )
}

function CurlModalContents() {
  let dispatch = useDispatch()
  let [includeCreds, setIncludeCreds] = useState(false)
  let program = useSelector(getSearchProgram)
  let {username, password} = useSelector(getCurrentCluster)
  let info = dispatch(inspectSearch(program))

  function getCreds() {
    if (includeCreds) return `-u ${username}:${password}`
    else return ""
  }
  return (
    <TextContent>
      {info && (
        <pre id="copy-to-curl-code" {...reactElementProps("curlCommand")}>
          curl -X {info.method} {getCreds()} -d &apos;
          {JSON.stringify(info.body, null, 2)}
          &apos; {info.url}
        </pre>
      )}
      {!info && (
        <pre id="copy-to-curl-code" {...reactElementProps("curlCommand")}>
          Invalid ZQL: &apos;{program}&apos;
        </pre>
      )}
      <Form>
        <InputCheckbox
          label="Include Credentials:"
          checked={includeCreds}
          onChange={(e) => setIncludeCreds(e.target.checked)}
        />
      </Form>
    </TextContent>
  )
}
