/* @flow */
import React, {useState} from "react"
import classNames from "classnames"

import {reactElementProps} from "../test/integration"
import Folder from "../icons/Folder"
import PcapFileIcon from "../icons/PcapFileIcon"
import ToolbarButton from "./ToolbarButton"
import ZeekFileIcon from "../icons/ZeekFileIcon"
import useCallbackRef from "./hooks/useCallbackRef"

type Props = {
  onChange: (e: Event, string[]) => void
}

export default function LoadFilesInput({onChange}: Props) {
  function _onChange(e) {
    let paths = Array.from(e.target.files).map((f) => f.path)
    onChange(e, paths)
  }
  let [dragging, setDragging] = useState(false)
  let [input, setInput] = useCallbackRef()

  function openDialog() {
    if (input) input.click()
  }

  function onDragOver(e) {
    e.preventDefault()
  }

  function onDrop(e) {
    setDragging(false)
    let paths = Array.from(e.dataTransfer.files).map((f) => f.path)
    onChange(e, paths)
  }

  function onDragEnter(e) {
    e.preventDefault()
    setDragging(true)
  }

  function onDragLeave(e) {
    e.preventDefault()
    setDragging(false)
  }

  return (
    <div
      className={classNames("load-files-input", {dragging})}
      {...{onDragOver, onDrop, onDragEnter, onDragLeave}}
    >
      <input
        ref={setInput}
        type="file"
        multiple
        title=""
        onChange={_onChange}
        {...reactElementProps("pcapsFileInput")}
      />
      <div className="radiation">
        <div />
        <div />
        <div />
      </div>
      <div className="content">
        <div className="controls">
          <ToolbarButton text="Choose Files" onClick={openDialog} />
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
          <Folder /> Drop to load...
        </p>
      </div>
    </div>
  )
}
