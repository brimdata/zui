/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import IngestProgress from "./IngestProgress"
import LogoType from "../icons/LogoType"
import PcapFileInput from "./PcapFileInput"
import SavedSpacesList from "./SavedSpacesList"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import openPacket from "../flows/openPacket"
import refreshSpaceNames from "../flows/refreshSpaceNames"

function getPercent(space): number {
  if (!space) return 0
  else if (space.ingest_progress === null) return 1
  else return space.ingest_progress
}

export default function NewTabContent() {
  let dispatch = useDispatch()
  let id = useSelector(Tab.clusterId)
  let files = useSelector(Spaces.names(id))
  let filesPresent = files.length !== 0
  let space = useSelector(Tab.space)
  let percent = getPercent(space)

  useEffect(() => {
    dispatch(refreshSpaceNames())
  }, [])

  function onChange(_e, [file]) {
    if (!file) return
    dispatch(openPacket(file))
  }

  return (
    <div className="new-tab-content">
      {space && <IngestProgress percent={percent} />}
      {!space && (
        <>
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
        </>
      )}
    </div>
  )
}
