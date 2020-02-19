/* @flow */
import {useDispatch} from "react-redux"
import React from "react"

import LogoType from "../icons/LogoType"
import PcapFileInput from "./PcapFileInput"
import SavedSpacesList from "./SavedSpacesList"
import Search from "../state/Search"
import View from "../state/View"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"

export default function NewTabContent() {
  let dispatch = useDispatch()
  function onChange(e, paths) {
    invoke(ipc.zqd.ingest("HelloWorld!", paths)).then((space) => {
      dispatch(View.setIsIngesting(true))
      invoke(ipc.zqd.subscribe()).then(() => {
        dispatch(View.setIsIngesting(false))
      })
      dispatch(Search.setSpace(space))
    })
  }

  return (
    <div className="new-tab-content">
      <section>
        <div className="logo">
          <LogoType />
        </div>
      </section>
      <div className="input-methods">
        <section>
          <label>Recent Files</label>
          <SavedSpacesList />
        </section>
        <div className="separator" />
        <section>
          <label>Open File</label>
          <PcapFileInput onChange={onChange} />
        </section>
      </div>
    </div>
  )
}
