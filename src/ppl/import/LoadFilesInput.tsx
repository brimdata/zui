import ToolbarButton from "src/app/query-home/toolbar/actions/button"
import classNames from "classnames"
import React, {MouseEvent} from "react"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import Folder from "src/js/icons/Folder"
import DataFileIcon from "./DataFileIcon"
import {useFilesDrop} from "src/util/hooks/use-files-drop"

type Props = {
  onChange: (files: File[]) => void
  className?: string
}

export default function LoadFilesInput(props: Props) {
  const [input, setInput] = useCallbackRef<HTMLInputElement>()
  const [{canDrop, isOver}, drop] = useFilesDrop({onDrop: props.onChange})

  function openDialog(_: MouseEvent) {
    if (input) input.click()
  }

  return (
    <div
      className={classNames(props.className, "load-files-input", {
        dragging: canDrop && isOver,
      })}
      ref={drop}
    >
      <input
        tabIndex={-1}
        ref={setInput}
        type="file"
        multiple
        title=""
        onChange={(e) => props.onChange(Array.from(e.currentTarget.files))}
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
