/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import BrimTextLogo from "./BrimTextLogo"
import PcapFileInput from "./PcapFileInput"
import SavedSpacesList from "./SavedSpacesList"
import SpaceDeletedNotice from "./SpaceDeletedNotice"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import ingestFiles from "../flows/ingestFiles"
import refreshSpaceNames from "../flows/refreshSpaceNames"

export default function TabWelcome() {
  let dispatch = useDispatch()
  let id = useSelector(Tab.clusterId)
  let spaces = useSelector(Spaces.getSpaces(id))
  let spacesPresent = spaces.length !== 0

  useEffect(() => {
    dispatch(refreshSpaceNames())
  }, [])

  function onChange(_e, files) {
    if (!files.length) return
    dispatch(ingestFiles(files))
  }

  return (
    <div className="tab-welcome">
      <SpaceDeletedNotice />
      <section>
        <BrimTextLogo />
      </section>
      <div className="input-methods">
        {spacesPresent && (
          <>
            <section>
              <label>Recent Spaces</label>
              <SavedSpacesList spaces={spaces} />
            </section>
            <div className="separator" />
          </>
        )}
        <section>
          <label>Open File</label>
          <PcapFileInput onChange={onChange} />
          <p className="accepted-files">
            Accepted formats are <b>.pcap</b> and <b>.pcapng</b>.
          </p>
        </section>
      </div>
    </div>
  )
}
