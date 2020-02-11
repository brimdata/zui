/* @flow */
import "regenerator-runtime/runtime"

import React from "react"
import ReactDOM from "react-dom"

import Brand from "./components/Login/Brand"
import PcapFileInput from "./components/PcapFileInput"
import initDOM from "./initializers/initDOM"
import invoke from "./electron/ipc/invoke"
import ipc from "./electron/ipc"
import lib from "./lib"

initDOM()

let zqdAddr = "localhost:9867"
invoke(ipc.zqd.info()).then(({addr}) => (zqdAddr = addr))

function SelectPcaps() {
  function onChange(e) {
    let paths = Array.from(e.target.files).map((f) => f.path)

    invoke(ipc.zqd.ingest("not-working", paths)).then((space) => {
      let [host, port] = zqdAddr.split(":")
      invoke(ipc.windows.redirect("search", {host, port, space}))
    })
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
