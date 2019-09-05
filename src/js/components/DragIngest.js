/* @flow */
import {isEmpty} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useRef, useState} from "react"

import {getCurrentSpaceName} from "../state/reducers/spaces"
import {getFormData} from "../stdlib/form"
import {initSpace} from "../space/thunks"
import CheckCircle from "./CheckCircle"
import ErrorFactory from "../models/ErrorFactory"
import Form from "./form/Form"
import InputSelectMultiple from "./form/InputSelectMultiple"
import InputSubmit from "./form/InputSubmit"
import LoadingDots from "./LoadingDots"
import Modal from "./Modal"
import XCircle from "./XCircle"
import lib from "../lib"
import useListener from "../hooks/useListener"

export default function DragIngest() {
  let [display, setDisplay] = useState("none")
  let [files, setFiles] = useState([])
  let [selected, setSelected] = useState([])
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

  function onSubmit(e) {
    e.preventDefault()
    let form = e.target
    let data = getFormData(form, "space", "files")
    let files = data.files.split(";")
    setSelected(files)
  }

  function onClose() {
    setFiles([])
    setSelected([])
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

      <Modal
        isOpen={!isEmpty(files)}
        title="Ingest Zeek Files"
        onClose={onClose}
      >
        {isEmpty(selected) ? (
          <IngestForm onSubmit={onSubmit} files={files} />
        ) : (
          <IngestTable files={selected} />
        )}
      </Modal>
    </div>
  )
}

function IngestForm({onSubmit, files}) {
  return (
    <Form onSubmit={onSubmit}>
      <InputSelectMultiple label="Files:" name="files" options={files} />
      <InputSubmit value="Ingest" />
    </Form>
  )
}

function IngestTable({files}) {
  return (
    <div>
      <ul className="ingest-table">
        {files.map((p) => (
          <IngestFile path={p} key={p} />
        ))}
      </ul>
    </div>
  )
}

function IngestFile({path}) {
  let [status, setStatus] = useState("Ingesting...")
  let [error, setError] = useState(null)
  let dispatch = useDispatch()

  useEffect(() => {
    dispatch((dispatch, getState, boom) => {
      let space = getCurrentSpaceName(getState())
      lib
        .file(path)
        .read()
        .then((buff) => {
          boom
            .ingest(space, new File([buff], path))
            .done(() => {
              setStatus("Ok")
            })
            .error((e) => {
              setStatus("Error")
              setError(e)
            })
        })
    })
  }, [])

  function renderStatus(s) {
    switch (s) {
      case "Ok":
        return <CheckCircle />
      case "Error":
        return <XCircle />
      default:
        return <LoadingDots />
    }
  }

  return (
    <li>
      <span className="status">{renderStatus(status)}</span>
      <span>
        {path}{" "}
        {error && (
          <span className="error">
            ({ErrorFactory.create(error).message()})
          </span>
        )}
      </span>
    </li>
  )
}
