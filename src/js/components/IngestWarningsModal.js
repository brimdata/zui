/* @flow */

import {useSelector} from "react-redux"
import React from "react"

import ModalBox from "./ModalBox/ModalBox"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import TextContent from "./TextContent"

export default function IngestWarningsModal() {
  let id = useSelector(Tab.clusterId)
  let name = useSelector(Tab.spaceName)
  let warnings = useSelector(Spaces.getIngestWarnings(id, name))

  return (
    <ModalBox
      name="ingest-warnings"
      className="whois-modal"
      title="Ingest Warnings"
      buttons="Done"
    >
      <TextContent>
        <pre className="output">{warnings.join("\n")}</pre>
      </TextContent>
    </ModalBox>
  )
}
