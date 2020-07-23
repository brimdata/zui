/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import classNames from "classnames"

import type {Space} from "../state/Spaces/types"
import {initSpace} from "../flows/initSpace"
import {showContextMenu} from "../lib/System"
import ArchiveBorderIcon from "../icons/ArchiveBorderIcon"
import EmptySection from "./common/EmptySection"
import FileBorder from "../icons/FileBorder"
import FileFilled from "../icons/FileFilled"
import ProgressIndicator from "./ProgressIndicator"
import Tab from "../state/Tab"
import brim from "../brim"
import menu from "../electron/menu"

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

  if (spaces.length === 0)
    return (
      <EmptySection
        icon={<FileFilled />}
        message="You have no spaces yet. Create a space by importing data."
      />
    )

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
              className={classNames("space-link", {
                "current-space-link": s.id === currentSpaceId
              })}
            >
              {s.storage_kind === "archivestore" ? (
                <ArchiveBorderIcon className="space-icon" />
              ) : (
                <FileBorder className="space-icon" />
              )}

              <span className="name">{s.name}</span>
              {progress}
            </a>
          </li>
        )
      })}
    </menu>
  )
}
