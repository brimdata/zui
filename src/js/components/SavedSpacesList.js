/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {remote} from "electron"

import {initSpace} from "../flows/initSpace"
import Folder from "../icons/Folder"
import TrashBin from "../icons/TrashBin"
import deleteSpace from "../flows/deleteSpace"
import Spaces from "../state/Spaces/selectors"
import {isNumber} from "lodash"
import ProgressIndicator from "./ProgressIndicator"

type Props = {|
  files: string[],
  clusterID: string
|}

export default function SavedSpacesList({files, clusterID}: Props) {
  let dispatch = useDispatch()

  const onClick = (space) => (e) => {
    e.preventDefault()
    dispatch(initSpace(space))
  }

  const onDelete = (space) => (e) => {
    e.preventDefault()
    remote.dialog
      .showMessageBox({
        type: "warning",
        title: "Delete Space",
        message: `Are you sure you want to delete ${space}?`,
        detail:
          "This will delete the created .brim folder, but will preserve the original pcap file.",
        buttons: ["OK", "Cancel"]
      })
      .then(({response}) => {
        if (response === 0) dispatch(deleteSpace(space))
      })
  }

  return (
    <menu className="saved-spaces-list">
      {files.map((file) => {
        const value = useSelector(Spaces.getIngestProgress(clusterID, file))
        const trashOrProgress = isNumber(value) ? (
          <div className="small-progress-bar">
            <ProgressIndicator percent={value} />
          </div>
        ) : (
          <a href="#" onClick={onDelete(file)} className="delete-link">
            <TrashBin className="delete-icon" />
          </a>
        )

        return (
          <li key={file}>
            <a href="#" onClick={onClick(file)} className="space-link">
              <Folder className="space-icon" />
              <span className="name">{file}</span>
            </a>
            {trashOrProgress}
            <div className="line" />
          </li>
        )
      })}
    </menu>
  )
}
