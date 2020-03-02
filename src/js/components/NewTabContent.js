/* @flow */
import {useDispatch} from "react-redux"
import React, {useState} from "react"
import fsExtra from "fs-extra"

import {initSpace} from "../flows/initSpace"
import {useGlobalSelector} from "../state/GlobalContext"
import ErrorFactory from "../models/ErrorFactory"
import IngestProgress from "./IngestProgress"
import LogoType from "../icons/LogoType"
import Notice from "../state/Notice"
import PcapFileInput from "./PcapFileInput"
import RecentFiles from "../state/RecentFiles"
import SavedSpacesList from "./SavedSpacesList"
import zealot from "../services/zealot"

export default function NewTabContent() {
  let dispatch = useDispatch()
  let files = useGlobalSelector(RecentFiles.getPaths)
  let filesPresent = files.length !== 0
  let [loading, setLoading] = useState(false)

  function onChange(_e, [file]) {
    if (!file) return
    let dir = file + ".brim"
    let client = zealot.client("localhost:9867")
    let space
    setLoading(true)
    fsExtra
      .ensureDir(dir)
      .then(() => client.spaces.create({data_dir: dir}))
      .then(({name}) => {
        space = name
        return client.pcaps.post({space, path: file})
      })
      .finally(() => setLoading(false))
      .then(() => dispatch(initSpace(space)))
      .catch((e) => dispatch(Notice.set(ErrorFactory.create(e))))
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
        </>
      )}
    </div>
  )
}
