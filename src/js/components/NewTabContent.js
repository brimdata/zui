/* @flow */
import React from "react"
import fsExtra from "fs-extra"

import {useGlobalSelector} from "../state/GlobalContext"
import LogoType from "../icons/LogoType"
import PcapFileInput from "./PcapFileInput"
import RecentFiles from "../state/RecentFiles"
import SavedSpacesList from "./SavedSpacesList"
import zealot from "../services/zealot"

export default function NewTabContent() {
  let files = useGlobalSelector(RecentFiles.getPaths)
  let filesPresent = files.length !== 0

  function onChange(_e, [file]) {
    if (!file) return
    let dir = file + ".brim"
    let client = zealot.client("localhost:9867")
    fsExtra
      .ensureDir(dir)
      .then(() => client.spaces.create({dir}))
      .catch((e) => {
        console.error(
          `POST /space with {dir: '${dir}'} is not ready yet. Response was:`,
          e
        )
        return {name: "Not-Implemented"}
      })
      .then(({name}) => client.pcaps.post({space: name, path: file}))
      .catch((e) => {
        console.error(
          `POST /space/<name>/pcaps with {path: '${file}'} is not ready yet. Response was:`,
          e
        )
        throw "Not Implemented"
      })
      .then(() => console.log("IT IS WORKING!"))
      .catch((e) => {
        alert("NEW FEATURE IN PROGRESS")
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
