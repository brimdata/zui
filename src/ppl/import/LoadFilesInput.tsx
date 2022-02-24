import {useBrimApi} from "src/app/core/context"
import {useImportOnDrop} from "src/app/features/import/use-import-on-drop"
import ToolbarButton from "src/app/toolbar/button"
import classNames from "classnames"
import React, {ChangeEvent, MouseEvent} from "react"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import Folder from "src/js/icons/Folder"
import DataFileIcon from "./DataFileIcon"

export default function LoadFilesInput() {
  const api = useBrimApi()
  const [input, setInput] = useCallbackRef<HTMLInputElement>()
  const [{canDrop, isOver}, drop] = useImportOnDrop()

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    api.import(Array.from(e.target.files))
  }

  function openDialog(_: MouseEvent) {
    if (input) input.click()
  }

  return (
    <div
      className={classNames("load-files-input", {dragging: canDrop && isOver})}
      ref={drop}
    >
      <input
        tabIndex={-1}
        ref={setInput}
        type="file"
        multiple
        title=""
        onChange={onChange}
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
          <div className="files-stack">
            <DataFileIcon />
            <DataFileIcon />
            <DataFileIcon />
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
