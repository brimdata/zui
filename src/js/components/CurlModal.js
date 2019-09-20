/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useState} from "react"

import {InputCheckbox} from "./form/Inputs"
import {copyToClipboard} from "../lib/Doc"
import {getCurrentCluster} from "../state/clusters/selectors"
import {getSearchProgram} from "../state/selectors/searchBar"
import {inspectSearch} from "../backend/thunks"
import Form from "./form/Form"
import Modal from "./Modal"
import TextContent from "./TextContent"

export default function CurlModal() {
  let dispatch = useDispatch()
  let [includeCreds, setIncludeCreds] = useState(false)
  let program = useSelector(getSearchProgram)
  let {username, password} = useSelector(getCurrentCluster)
  let info = dispatch(inspectSearch(program))

  function getCreds() {
    if (includeCreds) return `-u ${username}:${password}`
    else return ""
  }

  function copyToClip() {
    var node = document.getElementById("copy-to-curl-code")
    if (node) copyToClipboard(node.textContent)
  }

  let buttons = [
    {
      label: "Copy",
      click: copyToClip
    },
    {
      label: "Done",
      click: (close) => close()
    }
  ]

  return (
    <Modal
      buttons={buttons}
      name="curl"
      className="curl-modal"
      title="Curl Command"
    >
      <TextContent>
        {info && (
          <pre id="copy-to-curl-code">
            curl -X {info.method} {getCreds()} -d &apos;
            {JSON.stringify(info.body, null, 2)}
            &apos; {info.url}
          </pre>
        )}
        {!info && (
          <pre id="copy-to-curl-code">
            Invalid Lookytalk: &apos;{program}&apos;
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
    </Modal>
  )
}
