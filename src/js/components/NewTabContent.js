/* @flow */
import {useDispatch} from "react-redux"
import React from "react"

import PcapFileInput from "./PcapFileInput"
import SavedSpacesList from "./SavedSpacesList"
import Search from "../state/Search"
import Volcano from "./Login/Volcano"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"

export default function NewTabContent() {
  let dispatch = useDispatch()
  function onChange(e, paths) {
    invoke(ipc.zqd.ingest("HelloWorld!", paths)).then((space) => {
      dispatch(Search.setSpace(space))
    })
  }

  return (
    <div className="new-tab-content">
      <section>
        <div className="logo">
          <Volcano />
        </div>
      </section>
      <section>
        <label>Open PCAPs</label>
        <PcapFileInput onChange={onChange} />
      </section>
      <section>
        <label>Open Saved Space</label>
        <SavedSpacesList />
      </section>
    </div>
  )
}
