/* @flow */
import {isEmpty} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React, {useRef, useState} from "react"

import {getCurrentSpaceName} from "../../state/reducers/spaces"
import {initSpace} from "../../space/thunks"
import IngestModal from "./IngestModal"
import lib from "../../lib"
import useListener from "../../hooks/useListener"

export default function DragIngest() {
  let [display, setDisplay] = useState("none")
  let [files, setFiles] = useState([])
  let dispatch = useDispatch()
  let space = useSelector(getCurrentSpaceName)

  useListener(useRef(document.body), "dragenter", () => setDisplay("inherit"))

  function allowDrag(e) {
    e.dataTransfer.dropEffect = "copy"
    e.preventDefault()
  }

  function onDrop(e) {
    e.preventDefault()
    let files = e.dataTransfer.files
    let paths = Array.from(files).map((f) => f.path)
    Promise.all(paths.map((p) => lib.file(p).allFiles()))
      .then((results) => results.reduce((all, one) => all.concat(one), []))
      .then(setFiles)
    setDisplay("none")
  }

  function onClose() {
    setFiles([])
    setDisplay("none")
    dispatch(initSpace(space))
  }

  return (
    <div
      className="drag-ingest"
      style={{display}}
      onDragLeave={() => setDisplay("none")}
      onDragEnter={allowDrag}
      onDragOver={allowDrag}
      onDrop={onDrop}
    >
      <div className="message">
        <h2>Drop Zeek files to ingest in to this space.</h2>
      </div>
      <IngestModal isOpen={!isEmpty(files)} onClose={onClose} files={files} />
    </div>
  )
}
