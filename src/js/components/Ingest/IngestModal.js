/* @flow */
import {isEmpty} from "lodash"
import React, {useState} from "react"

import {getFormData} from "../../stdlib/form"
import Form from "../form/Form"
import IngestFile from "./IngestFile"
import InputSelectMultiple from "../form/InputSelectMultiple"
import InputSubmit from "../form/InputSubmit"
import Modal from "../Modal"

type Props = {
  isOpen: boolean,
  onClose: Function,
  files: string[]
}

export default function IngestModal({isOpen, onClose, files}: Props) {
  let [selected, setSelected] = useState([])

  function onThisClose() {
    onClose()
    setSelected([])
  }

  function onSubmit(e) {
    e.preventDefault()
    let form = e.target
    let data = getFormData(form, "files")
    if (isEmpty(data.files)) {
      onClose()
    } else {
      setSelected(data.files.split(";"))
    }
  }

  return (
    <Modal isOpen={isOpen} title="Ingest Zeek Files" onClose={onThisClose}>
      {isEmpty(selected) ? (
        <IngestForm onSubmit={onSubmit} files={files} />
      ) : (
        <IngestTable files={selected} />
      )}
    </Modal>
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
