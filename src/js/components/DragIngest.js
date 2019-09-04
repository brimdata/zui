/* @flow */
import {isEmpty} from "lodash"
import React, {useRef, useState} from "react"

import Form from "./form/Form"
import Input from "./form/Input"
import InputSelectMultiple from "./form/InputSelectMultiple"
import InputSubmit from "./form/InputSubmit"
import Modal from "./Modal"
import lib from "../lib"
import useListener from "../hooks/useListener"

export default function DragIngest() {
  let [display, setDisplay] = useState("none")
  let [files, setFiles] = useState([])

  useListener(useRef(document.body), "dragenter", () => setDisplay("block"))

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
    // dispatch((dispatch, getState, boom) => {
    //   let space = getCurrentSpaceName(getState())
    //   boom.ingest(space, files[0]).done(() => {
    //     dispatch(submitSearchBar())
    //   })
    // })
  }

  function onSubmit(e) {
    e.preventDefault()
    // let form = e.target
    // let data = getFormData(form, "space", "files")
    setFiles([])
    setDisplay("none")
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
      <h2>Drop Zeek Files to Ingest in to this space.</h2>
      <Modal
        isOpen={!isEmpty(files)}
        title="Ingest Zeek Files"
        onClose={() => setFiles([])}
      >
        <Form onSubmit={onSubmit}>
          <Input label="Space:" name="space" />
          <InputSelectMultiple label="Files:" name="files" options={files} />
          <InputSubmit value="Ingest" />
        </Form>
      </Modal>
    </div>
  )
}
