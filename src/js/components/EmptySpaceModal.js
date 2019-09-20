/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import {getCurrentSpaceName} from "../state/reducers/spaces"
import Modal from "./Modal"
import TextContent from "./TextContent"

export default function EmptySpaceModal() {
  let space = useSelector(getCurrentSpaceName)
  return (
    <Modal title="Empty Space" name="nodata" buttons="Ok">
      <TextContent>
        <p>
          There is no data in this space. Use the boom cli to ingest zeek logs
          into this space.
        </p>
        <pre>boom post -s {space} /path/to/zeek/*.log</pre>
      </TextContent>
    </Modal>
  )
}
