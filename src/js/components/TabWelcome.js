/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import LogoType from "../icons/LogoType"
import PcapFileInput from "./PcapFileInput"
import SavedSpacesList from "./SavedSpacesList"
import SpaceDeletedNotice from "./SpaceDeletedNotice"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import openPacket from "../flows/openPacket"
import refreshSpaceNames from "../flows/refreshSpaceNames"

export default function TabWelcome() {
  let dispatch = useDispatch()
  let id = useSelector(Tab.clusterId)
  let files = useSelector(Spaces.names(id))
  let filesPresent = files.length !== 0

  useEffect(() => {
    dispatch(refreshSpaceNames())
  }, [])

  function onChange(_e, [file]) {
    if (!file) return
    dispatch(openPacket(file))
  }

  return (
    <div className="tab-welcome">
      <SpaceDeletedNotice />
      <section>
        <div className="logo">
          <LogoType />
        </div>
      </section>
      <div className="input-methods">
        {filesPresent && (
          <>
            <section>
              <label>Recent Spaces</label>
              <SavedSpacesList files={files} />
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
