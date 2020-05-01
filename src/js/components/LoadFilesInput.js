/* @flow */
import React from "react"
import classNames from "classnames"

import {reactElementProps} from "../test/integration"
import Folder from "../icons/Folder"
import PcapFileIcon from "../icons/PcapFileIcon"
import ToolbarButton from "./ToolbarButton"
import ZeekFileIcon from "../icons/ZeekFileIcon"
import useCallbackRef from "./hooks/useCallbackRef"
import useDropzone from "./hooks/useDropzone"

type Props = {
  onChange: (e: Event, string[]) => void
}

export default function LoadFilesInput({onChange}: Props) {
  let [input, setInput] = useCallbackRef()

  let [bindDropzone, dragging] = useDropzone((e) => {
    let paths = Array.from(e.dataTransfer.files).map((f) => f.path)
    onChange(e, paths)
  })

  function _onChange(e) {
    let paths = Array.from(e.target.files).map((f) => f.path)
    onChange(e, paths)
  }

  function openDialog() {
    if (input) input.click()
  }

  return (
    <div
      className={classNames("load-files-input", {dragging})}
      {...bindDropzone()}
    >
      <input
        ref={setInput}
        type="file"
        multiple
        title=""
        onChange={_onChange}
        {...reactElementProps("ingestFilesInput")}
      />
      <div className="radiation">
        <div />
        <div />
        <div />
      </div>
      <div className="content">
        <div className="controls">
          <ToolbarButton
            text="Choose Files"
            onClick={openDialog}
            {...reactElementProps("ingestFilesButton")}
          />
          <p>Or drag & drop them here.</p>
        </div>
        <div className="file-types">
          <PcapFileIcon />
          <div className="zeek-files-stack">
            <ZeekFileIcon />
            <ZeekFileIcon />
            <ZeekFileIcon />
          </div>
        </div>
      </div>
      <div className="drag-over-content">
        <p>
          <Folder /> Drop to import...
        </p>
      </div>
    </div>
  )
}
