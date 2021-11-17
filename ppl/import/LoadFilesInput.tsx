import {useBrimApi} from "app/core/context"
import {useImportOnDrop} from "app/features/import/use-import-on-drop"
import ToolbarButton from "app/toolbar/button"
import classNames from "classnames"
import React, {ChangeEvent, MouseEvent} from "react"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import Folder from "src/js/icons/Folder"
import {reactElementProps} from "test/integration/helpers/integration"
import DataFileIcon from "./DataFileIcon"

export default function LoadFilesInput() {
  const api = useBrimApi()
  const [input, setInput] = useCallbackRef<HTMLInputElement>()
  const [{canDrop, isOver}, drop] = useImportOnDrop()

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    e.persist()
    console.log(e.target)
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
