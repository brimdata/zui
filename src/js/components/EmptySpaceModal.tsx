import React from "react"

import ModalBox from "./ModalBox/ModalBox"
import TextContent from "./TextContent"

export default function EmptySpaceModal() {
  return (
    <ModalBox
      title="Empty Space"
      className="empty-space-modal"
      name="nodata"
      buttons="Ok"
    >
      <TextContent>
        <p>There is no data in this space.</p>
      </TextContent>
    </ModalBox>
  )
}
