/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import ErrorFactory from "../models/ErrorFactory"
import IngestProgress from "./IngestProgress"
import LogoType from "../icons/LogoType"
import Notice from "../state/Notice"
import PcapFileInput from "./PcapFileInput"
import SavedSpacesList from "./SavedSpacesList"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import openPacket from "../flows/openPacket"
import refreshSpaceNames from "../flows/refreshSpaceNames"

export default function NewTabContent() {
  let dispatch = useDispatch()
  let id = useSelector(Tab.clusterId)
  let files = useSelector(Spaces.names(id))
  let filesPresent = files.length !== 0
  let [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(refreshSpaceNames())
  }, [])

  function onChange(_e, [file]) {
    if (!file) return
    setLoading(true)
    dispatch(openPacket(file)).catch((e) =>
      dispatch(Notice.set(ErrorFactory.create(e)))
    )
  }

  return (
    <div className="new-tab-content">
      {loading && <IngestProgress />}
      {!loading && (
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
                  <label>Recent Files</label>
                  <SavedSpacesList files={files} />
                </section>
                <div className="separator" />
              </>
            )}
            <section>
              <label>Open File</label>
              <PcapFileInput onChange={onChange} />
            </section>
          </div>
        </>
      )}
    </div>
  )
}
