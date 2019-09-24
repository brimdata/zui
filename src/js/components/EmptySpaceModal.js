/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import {getCurrentSpaceName} from "../state/reducers/spaces"
import ModalBox from "./ModalBox/ModalBox"
import TextContent from "./TextContent"

export default function EmptySpaceModal() {
  let space = useSelector(getCurrentSpaceName)
  return (
    <ModalBox
      title="Empty Space"
      className="empty-space-modal"
      name="nodata"
      buttons="Ok"
    >
      <TextContent>
        <p>
          There is no data in this space. Use the boom cli to ingest zeek logs
          into this space.
        </p>
        <pre>boom post -s {space} /path/to/zeek/*.log</pre>
      </TextContent>
    </ModalBox>
  )
}
