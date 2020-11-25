import React, {ChangeEvent, MouseEvent} from "react"
import classNames from "classnames"

import {reactElementProps} from "../test/integration"
import Folder from "../icons/Folder"
import PcapFileIcon from "../icons/PcapFileIcon"
import ToolbarButton from "./Toolbar/Button"
import ZeekFileIcon from "../icons/ZeekFileIcon"
import useCallbackRef from "./hooks/useCallbackRef"
import useDropzone from "./hooks/useDropzone"

type Props = {
  onChange: (e, files: File[]) => void
}

export default function LoadFilesInput({onChange}: Props) {
  const [input, setInput] = useCallbackRef()

  const [bindDropzone, dragging] = useDropzone((e: DragEvent) => {
    const files = Array.from(e.dataTransfer.files)
    onChange(e, files)
  })

  function _onChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files)
    onChange(e, files)
  }

  function openDialog(_: MouseEvent) {
    if (input) input.click()
  }

  return (
    <div
      className={classNames("load-files-input", {dragging})}
      {...bindDropzone()}
    >
      <input
        tabIndex={-1}
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
