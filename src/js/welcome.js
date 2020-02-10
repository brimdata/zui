/* @flow */
import "regenerator-runtime/runtime"

import React, {useEffect} from "react"
import ReactDOM from "react-dom"

import {ipcRenderer} from "electron"

import Brand from "./components/Login/Brand"
import PcapFileInput from "./components/PcapFileInput"
import initDOM from "./initializers/initDOM"
import ipc from "./electron/ipc"
import lib from "./lib"
import route from "./electron/ipc/route"

initDOM()
ipcRenderer.invoke("zqd:info").then((result) => {
  console.log("zqd.started", result)
})

function SelectPcaps() {
  useEffect(() => {
    ipcRenderer.on("pcaps:update", (e, args) => {
      console.log(args)
    })
  }, [])

  function onChange(e) {
    let paths = Array.from(e.target.files).map((f) => f.path)
    let space = "Untitled"

    route(ipc.zqd.ingest(space, paths)).then((result) => {
      console.log("RESULT", result)
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
