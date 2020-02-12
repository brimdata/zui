/* @flow */
import React from "react"

import BrimText from "../icons/brim-text.svg"
import PcapFileInput from "./PcapFileInput"
import SavedSpacesList from "./SavedSpacesList"
import Volcano from "./Login/Volcano"

export default function NewTabContent() {
  return (
    <div className="new-tab-content">
      <section>
        <div className="logo">
          <Volcano />
          <BrimText />
        </div>
      </section>
      <section>
        <label>Open PCAPs</label>
        <PcapFileInput />
      </section>
      <section>
        <label>Open Saved Space</label>
        <SavedSpacesList />
      </section>
    </div>
  )
}
