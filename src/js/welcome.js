/* @flow */
import "regenerator-runtime/runtime"

import React from "react"
import ReactDOM from "react-dom"

import {ipcRenderer} from "electron"

import Brand from "./components/Login/Brand"
import PcapFileInput from "./components/PcapFileInput"
import initDOM from "./initializers/initDOM"
import lib from "./lib"

initDOM()
ipcRenderer.invoke("zqd:info").then((result) => {
  console.log("zqd.started", result)
})

function SelectPcaps() {
  function onChange(e) {
    let paths = Array.from(e.target.files).map((f) => f.path)
    let space = "corelight"
    ipcRenderer.invoke("pcaps:ingest", {space, paths}).then(() => {
      ipcRenderer.invoke("redirect:search", space)
    })
    ipcRenderer.send("pcaps:ingest", {space, paths})
  }

  return (
    <div className="select-pcaps">
      <div className="title-bar-drag-area" />
      <aside>
        <Brand />
        <p>
          Brim takes PCAPs, transforms them into Zeek logs, then provides search
          and analytics of the network data.
        </p>
      </aside>
      <main>
        <h1>Select Packet Captures (PCAPs)</h1>
        <PcapFileInput onChange={onChange} />
      </main>
    </div>
  )
}

ReactDOM.render(<SelectPcaps />, lib.doc.id("app-root"))
