/* @flow */
import "regenerator-runtime/runtime"

import React from "react"
import ReactDOM from "react-dom"

import {ipcRenderer} from "electron"

import Brand from "./components/Login/Brand"
import PcapFileSvg from "./icons/pcap-file.svg"
import ArrowOrangeSvg from "./icons/arrow-orange.svg"
import initDOM from "./initializers/initDOM"
import lib from "./lib"

initDOM()

function SelectPcaps() {
  function onChange(e) {
    let paths = Array.from(e.target.files).map((f) => f.path)
    let space = "Untitled"
    ipcRenderer.invoke("pcaps:ingest", {space, paths}).then((result) => {
      console.log(result)
    })
  }

  return (
    <div className="select-pcaps">
      <aside>
        <Brand />
        <p>
          Brim takes PCAPs, transforms them into Zeek logs, then provides search
          and analytics of the network data.
        </p>
      </aside>
      <main>
        <h1>Select Packet Captures (PCAPs)</h1>
        <div className="file-input-wrapper">
          <PcapFileSvg className="pcap-file" />
          <ArrowOrangeSvg className="upload-arrow" />
          <input type="file" multiple onChange={onChange} />
        </div>
      </main>
    </div>
  )
}

ReactDOM.render(<SelectPcaps />, lib.doc.id("app-root"))
