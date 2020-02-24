/* @flow */
import React from "react"

import {useGlobalSelector} from "../state/GlobalContext"
import LogoType from "../icons/LogoType"
import PcapFileInput from "./PcapFileInput"
import RecentFiles from "../state/RecentFiles"
import SavedSpacesList from "./SavedSpacesList"

export default function NewTabContent() {
  let files = useGlobalSelector(RecentFiles.getPaths)
  let filesPresent = files.length !== 0

  function onChange(_e, _paths) {
    alert("New Feature: This feature is still in progress")
    return
    // globalDispatch(RecentFiles.open(paths[0]))
    //
    // invoke(ipc.zqd.ingest("HelloWorld!", paths)).then((space) => {
    //   dispatch(View.setIsIngesting(true))
    //   invoke(ipc.zqd.subscribe()).then(() => {
    //     dispatch(View.setIsIngesting(false))
    //   })
    //   dispatch(Search.setSpace(space))
    // })
  }

  return (
    <div className="new-tab-content">
      <section>
        <div className="logo">
          <LogoType />
        </div>
      </section>
      <div className="input-methods">
        {filesPresent && (
          <>
            <section>
              <label>Recent Files</label>
              <SavedSpacesList />
            </section>
            <div className="separator" />
          </>
        )}
        <section>
          <label>Open File</label>
          <PcapFileInput onChange={onChange} />
        </section>
      </div>
    </div>
  )
}
