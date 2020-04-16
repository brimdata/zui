/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"
import remote from "electron"

import BrimTextLogo from "./BrimTextLogo"
import LoadFilesInput from "./LoadFilesInput"
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
          <label>Load Files</label>
          <LoadFilesInput onChange={onChange} />
          <footer>
            <p>
              <b>Accepted formats:</b> .pcap, .pcapng, and{" "}
              <a
                onClick={() =>
                  remote.shell.openExternal(
                    "https://docs.zeek.org/en/current/scripts/base/frameworks/logging/writers/ascii.zeek.html"
                  )
                }
              >
                Zeek ASCII/JSON
              </a>
              .
            </p>
            <p>
              <b>Note:</b> Multiple Zeek logs can be loaded at once, but only
              one pcap.
            </p>
          </footer>
        </section>
      </div>
    </div>
  )
}
