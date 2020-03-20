/* @flow */
import {useDispatch} from "react-redux"
import React from "react"

import {remote} from "electron"

import {initSpace} from "../flows/initSpace"
import Folder from "../icons/Folder"
import TrashBin from "../icons/TrashBin"
import deleteSpace from "../flows/deleteSpace"
import {isNumber} from "lodash"
import ProgressIndicator from "./ProgressIndicator"
import type {Space} from "../state/Spaces/types"

type Props = {|
  spaces: Space[]
|}

export default function SavedSpacesList({spaces}: Props) {
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
      {spaces.map(({ingest_progress, name}) => {
        const trashOrProgress =
          ingest_progress && isNumber(ingest_progress) ? (
            <div className="small-progress-bar">
              <ProgressIndicator percent={ingest_progress} />
            </div>
          ) : (
            <a href="#" onClick={onDelete(name)} className="delete-link">
              <TrashBin className="delete-icon" />
            </a>
          )

        return (
          <li key={name}>
            <a href="#" onClick={onClick(name)} className="space-link">
              <Folder className="space-icon" />
              <span className="name">{name}</span>
            </a>
            {trashOrProgress}
            <div className="line" />
          </li>
        )
      })}
    </menu>
  )
}
