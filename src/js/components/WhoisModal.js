/* @flow */

import {useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import Modal from "./Modal"
import TextContent from "./TextContent"
import modal from "../modal"
import sys from "../sys"

export default function WhoisModal() {
  return (
    <Modal
      name="whois"
      title="Whois Lookup"
      className="whois-modal"
      buttons="Done"
    >
      <WhoIsRequest />
    </Modal>
  )
}

function WhoIsRequest() {
  let [text, setText] = useState("...Fetching...")
  let {addr} = useSelector(modal.getArgs)

  useEffect(() => {
    setTimeout(() => {
      sys
        .whois(addr)
        .then(setText)
        .catch(setText)
    }, 250)
  }, [])

  return (
    <TextContent>
      <pre>{addr}</pre>
      <pre className="output">{text}</pre>
    </TextContent>
  )
}
