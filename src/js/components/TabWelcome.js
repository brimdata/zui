/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import remote from "electron"

import BrimTextLogo from "./BrimTextLogo"
import ErrorFactory from "../models/ErrorFactory"
import LoadFilesInput from "./LoadFilesInput"
import Notice from "../state/Notice"
import SavedSpacesList from "./SavedSpacesList"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import errors from "../errors"
import ingestFiles from "../flows/ingestFiles"
import initNewTab from "../flows/initNewTab"
import refreshSpaceNames from "../flows/refreshSpaceNames"

export default function TabWelcome() {
  let dispatch = useDispatch()
  let id = useSelector(Tab.clusterId)
  let spaces = useSelector(Spaces.getSpaces(id))
  let spacesPresent = spaces.length !== 0

  useEffect(() => {
    dispatch(initNewTab())
  }, [])

  function onChange(_e, files) {
    if (!files.length) return
    dispatch(ingestFiles(files)).catch((e) => {
      ;/(Failed to fetch)|(network error)/.test(e.cause.message)
        ? dispatch(Notice.set(errors.importInterrupt()))
        : dispatch(Notice.set(ErrorFactory.create(e.cause)))

      dispatch(refreshSpaceNames())
      console.error(e.message)
    })
  }

  return (
    <div className="tab-welcome">
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
          <label>Import Files</label>
          <LoadFilesInput onChange={onChange} />
          <footer>
            <p>
              <b>Accepted formats:</b> .pcap, .pcapng,{" "}
              <a
                onClick={() =>
                  remote.shell.openExternal(
                    "https://github.com/brimsec/zq/blob/master/zng/docs/spec.md"
                  )
                }
              >
                .zng
              </a>
              , and{" "}
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
              <b>Note:</b> Multiple zng and Zeek log files may be imported, but
              only one pcap.
            </p>
          </footer>
        </section>
      </div>
    </div>
  )
}
