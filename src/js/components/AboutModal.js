/* @flow */
import React from "react"

import {reactElementProps} from "../test/integration"
import ModalBox from "./ModalBox/ModalBox"
import TextContent from "./TextContent"

export default function AboutModal() {
  return (
    <ModalBox
      name="about"
      title="About"
      buttons="Ok"
      {...reactElementProps("aboutModal")}
    >
      <TextContent>
        <div className="settings-form">
          <div className="setting-panel">
            <p>ALLL ABOUT BRIM</p>
          </div>
        </div>
      </TextContent>
    </ModalBox>
  )
}
