import {useDispatch, useSelector} from "react-redux"
import React from "react"
import classNames from "classnames"
import styled from "styled-components"

import {Space} from "../state/Spaces/types"
import {initSpace} from "../flows/initSpace"
import Current from "../state/Current"
import EmptySection from "./common/EmptySection"
import FileFilled from "../icons/FileFilled"
import ProgressIndicator from "./ProgressIndicator"
import SpaceIcon from "./SpaceIcon"
import brim from "../brim"
import menu from "../electron/menu"
import usePopupMenu from "./hooks/usePopupMenu"
import {remote} from "electron"
import deleteSpace from "../flows/deleteSpace"
import Modal from "../state/Modal/actions"
import Spaces from "../state/Spaces"
import deleteSpaces from "../flows/deleteSpaces"

type Props = {
  spaces: Space[]
}

const NameWrap = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
  overflow: hidden;
`

export default function SavedSpacesList({spaces}: Props) {
  if (spaces.length === 0)
    return (
      <EmptySection
        icon={<FileFilled />}
        message="You have no spaces yet. Create a space by importing data."
      />
    )

  return (
    <menu className="saved-spaces-list">
      {spaces
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((space) => {
          return <SpaceListItem key={space.id} space={space} />
        })}
    </menu>
  )
}

const SpaceListItem = ({space}: {space: Space}) => {
  const dispatch = useDispatch()
  const clusterId = useSelector(Current.getConnectionId)
  const currentSpaceId = useSelector(Current.getSpaceId)
  const spaceIds = useSelector(Spaces.ids(clusterId))
  const s = brim.space(space)

  const onClick = (e) => {
    e.preventDefault()
    dispatch(initSpace(s.id))
  }
  const contextMenu = usePopupMenu([
    {
      label: "Rename",
      click: () => {
        dispatch(Modal.show("space", {clusterId, spaceId: s.id}))
      }
    },
    {
      label: "Delete",
      click: () => {
        remote.dialog
          .showMessageBox({
            type: "warning",
            title: "Delete Space",
            message: `Are you sure you want to delete ${s.name}?`,
            buttons: ["OK", "Cancel"]
          })
          .then(({response}) => {
            if (response === 0) dispatch(deleteSpace(s.id))
          })
      }
    },
    {type: "separator"},
    {
      label: "Delete All",
      click: () => {
        remote.dialog
          .showMessageBox({
            type: "warning",
            title: "Delete All Spaces",
            message: `Are you sure you want to delete all spaces for this connection?`,
            buttons: ["OK", "Cancel"]
          })
          .then(({response}) => {
            if (response === 0) dispatch(deleteSpaces(spaceIds))
          })
      }
    }
  ])
  const progress = s.ingesting() && (
    <div className="small-progress-bar">
      <ProgressIndicator percent={s.ingestProgress()} />
    </div>
  )
  return (
    <li>
      <a
        href="#"
        onClick={onClick}
        onContextMenu={() => {
          !s.ingesting() && contextMenu.open()
        }}
        className={classNames("space-link", {
          "current-space-link": s.id === currentSpaceId
        })}
      >
        <NameWrap>
          <SpaceIcon type={s.getType()} className="space-icon" />
          <span className="name">{s.name}</span>
        </NameWrap>
        {progress}
      </a>
    </li>
  )
}
