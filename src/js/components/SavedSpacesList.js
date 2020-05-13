/* @flow */
import {useDispatch} from "react-redux"
import React from "react"

import {remote} from "electron"

import type {Space} from "../state/Spaces/types"
import {initSpace} from "../flows/initSpace"
import Folder from "../icons/Folder"
import ProgressIndicator from "./ProgressIndicator"
import TrashBin from "../icons/TrashBin"
import brim from "../brim"
import deleteSpace from "../flows/deleteSpace"

type Props = {|
  spaces: Space[]
|}

export default function SavedSpacesList({spaces}: Props) {
  let dispatch = useDispatch()

  const onClick = (space) => (e) => {
    e.preventDefault()
    dispatch(initSpace(space))
  }

  const onDelete = (spaceId, spaceName) => (e) => {
    e.preventDefault()
    remote.dialog
      .showMessageBox({
        type: "warning",
        title: "Delete Space",
        message: `Are you sure you want to delete ${spaceName}?`,
        buttons: ["OK", "Cancel"]
      })
      .then(({response}) => {
        if (response === 0) dispatch(deleteSpace(spaceId))
      })
  }

  return (
    <menu className="saved-spaces-list">
      {spaces.map(brim.space).map((s) => {
        const trashOrProgress = s.ingesting() ? (
          <div className="small-progress-bar">
            <ProgressIndicator percent={s.ingestProgress()} />
          </div>
        ) : (
          <a href="#" onClick={onDelete(s.id, s.name)} className="delete-link">
            <TrashBin className="delete-icon" />
          </a>
        )

        return (
          <li key={s.id}>
            <a href="#" onClick={onClick(s.id)} className="space-link">
              <Folder className="space-icon" />
              <span className="name">{s.name}</span>
            </a>
            {trashOrProgress}
            <div className="line" />
          </li>
        )
      })}
    </menu>
  )
}
