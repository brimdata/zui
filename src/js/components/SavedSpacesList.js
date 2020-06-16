/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import type {Space} from "../state/Spaces/types"
import {initSpace} from "../flows/initSpace"
import ProgressIndicator from "./ProgressIndicator"
import brim from "../brim"
import menu from "../electron/menu"
import {showContextMenu} from "../lib/System"
import File from "../icons/File"
import Tab from "../state/Tab"

type Props = {|
  spaces: Space[],
  spaceContextMenu: Function
|}

export default function SavedSpacesList({spaces, spaceContextMenu}: Props) {
  const dispatch = useDispatch()
  const currentSpaceId = useSelector(Tab.getSpaceId)

  const onClick = (space) => (e) => {
    e.preventDefault()
    dispatch(initSpace(space))
  }

  return (
    <menu className="saved-spaces-list">
      {spaces.map(brim.space).map((s) => {
        const progress = s.ingesting() && (
          <div className="small-progress-bar">
            <ProgressIndicator percent={s.ingestProgress()} />
          </div>
        )

        return (
          <li key={s.id}>
            <a
              href="#"
              onClick={onClick(s.id)}
              onContextMenu={() => {
                !s.ingesting() &&
                  showContextMenu(spaceContextMenu(s.id, s.name))
              }}
              className={`space-link ${
                s.id === currentSpaceId ? "current-space-link" : ""
              }`}
            >
              <File className="space-icon" />
              <span className="name">{s.name}</span>
              {progress}
            </a>
          </li>
        )
      })}
    </menu>
  )
}
