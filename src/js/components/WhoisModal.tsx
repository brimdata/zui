import {useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import ModalBox from "./ModalBox/ModalBox"
import TextContent from "./TextContent"
import modal from "../state/Modal"
import whois from "../services/whois"

export default function WhoisModal() {
  return (
    <ModalBox
      name="whois"
      title="Whois Lookup"
      className="whois-modal"
      buttons="Done"
    >
      <WhoIsRequest />
    </ModalBox>
  )
}

function WhoIsRequest() {
  const [text, setText] = useState("...Fetching...")
  const {addr} = useSelector(modal.getArgs)

  useEffect(() => {
    setTimeout(() => {
      whois(addr)
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
