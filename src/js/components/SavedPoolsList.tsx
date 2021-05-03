import {lakeSummaryPath} from "app/router/utils/paths"
import showPoolContextMenu from "app/pools/flows/show-pool-context-menu"
import classNames from "classnames"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {useHistory} from "react-router"
import styled from "styled-components"
import brim from "../brim"
import FileFilled from "../icons/FileFilled"
import Current from "../state/Current"
import {Pool} from "../state/Pools/types"
import {AppDispatch} from "../state/types"
import {WorkspaceStatus} from "../state/WorkspaceStatuses/types"
import {currentPoolItem, poolItem} from "../test/locators"
import EmptySection from "./common/EmptySection"
import ProgressIndicator from "./ProgressIndicator"
import PoolIcon from "./PoolIcon"

type Props = {
  pools: Pool[]
  workspaceStatus: WorkspaceStatus
}

const NameWrap = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
  overflow: hidden;
`

const PoolListItem = ({pool}: {pool: Pool}) => {
  const dispatch = useDispatch<AppDispatch>()
  const workspaceId = useSelector(Current.getWorkspaceId)
  const currentPoolId = useSelector(Current.getPoolId)

  const s = brim.pool(pool)
  const history = useHistory()
  const onClick = (e) => {
    e.preventDefault()
    history.push(lakeSummaryPath(s.id, workspaceId))
  }

  const progress = s.ingesting() && (
    <div className="small-progress-bar">
      <ProgressIndicator percent={s.ingestProgress()} />
    </div>
  )
  const current = s.id === currentPoolId
  const testProps = current ? currentPoolItem.props : poolItem.props
  return (
    <li>
      <a
        href="#"
        onClick={onClick}
        onContextMenu={() => dispatch(showPoolContextMenu(s))}
        className={classNames("pool-link", {"current-pool-link": current})}
        {...testProps}
      >
        <NameWrap>
          <PoolIcon className="pool-icon" />
          <span className="name">{s.name}</span>
        </NameWrap>
        {progress}
      </a>
    </li>
  )
}

export default function SavedPoolsList({pools, workspaceStatus}: Props) {
  if (workspaceStatus === "disconnected")
    return (
      <EmptySection
        icon={<FileFilled />}
        message="Unable to connect to service."
      />
    )
  if (workspaceStatus === "login-required")
    return (
      <EmptySection
        icon={<FileFilled />}
        message="Login required to view pools."
      />
    )
  if (pools.length === 0)
    return (
      <EmptySection
        icon={<FileFilled />}
        message="You have no pools yet. Create a pool by importing data."
      />
    )

  return (
    <menu className="saved-pools-list">
      {pools
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((pool) => {
          return <PoolListItem key={pool.id} pool={pool} />
        })}
    </menu>
  )
}
