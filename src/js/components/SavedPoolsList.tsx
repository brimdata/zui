import {useImportOnDrop} from "app/features/import/use-import-on-drop"
import {poolSearchPath} from "app/router/utils/paths"
import classNames from "classnames"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {useHistory} from "react-router"
import styled from "styled-components"
import {
  currentPoolItem,
  poolItem
} from "../../../test/playwright/helpers/locators"
import FileFilled from "../icons/FileFilled"
import Current from "../state/Current"
import {AppDispatch} from "../state/types"
import {LakeStatus} from "../state/LakeStatuses/types"
import EmptySection from "./common/EmptySection"
import PoolIcon from "./PoolIcon"
import ProgressIndicator from "./ProgressIndicator"
import {remoteQueriesPoolName} from "./LeftPane/remote-queries"
import Modal from "../state/Modal"
import {showContextMenu} from "../lib/System"
import getPoolContextMenu from "../../../app/pools/flows/get-pool-context-menu"
import {Pool} from "app/core/pools/pool"
import Ingests from "../state/Ingests"
import {isNumber} from "lodash"

type Props = {
  pools: Pool[]
  lakeStatus: LakeStatus
}

const NameWrap = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
  overflow: hidden;
`

const PoolListItem = ({pool}: {pool: Pool}) => {
  const dispatch = useDispatch<AppDispatch>()
  const lakeId = useSelector(Current.getLakeId)
  const currentPoolId = useSelector(Current.getPoolId)
  const ingest = useSelector(Ingests.get(pool.id))
  const p = pool
  const history = useHistory()
  const onClick = (e) => {
    e.preventDefault()
    history.push(poolSearchPath(p.id, lakeId))
  }

  const progress = ingest && isNumber(ingest.progress) && (
    <div className="small-progress-bar">
      <ProgressIndicator percent={ingest.progress} />
    </div>
  )
  const current = p.id === currentPoolId
  const testProps = current ? currentPoolItem.props : poolItem.props

  const showPoolContextMenu = () => {
    const renameMenuItem = {
      label: "Rename",
      click: () => {
        dispatch(Modal.show("pool", {lakeId, poolId: p.id}))
      }
    }
    const poolContextMenu = dispatch(getPoolContextMenu(p))
    showContextMenu([renameMenuItem, ...poolContextMenu])
  }

  return (
    <li>
      <a
        href="#"
        onClick={onClick}
        onContextMenu={() => showPoolContextMenu()}
        className={classNames("pool-link", {"current-pool-link": current})}
        {...testProps}
      >
        <NameWrap>
          <PoolIcon className="pool-icon" />
          <span className="name">{p.name}</span>
        </NameWrap>
        {progress}
      </a>
    </li>
  )
}

export default function SavedPoolsList({pools, lakeStatus}: Props) {
  const [, drop] = useImportOnDrop()
  if (lakeStatus === "disconnected")
    return (
      <EmptySection
        icon={<FileFilled />}
        message="Unable to connect to service."
      />
    )
  if (lakeStatus === "login-required")
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
    <nav className="saved-pools-list" ref={drop} aria-label="pools">
      {pools
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((pool) => {
          // Do not show remote queries pool in list
          if (pool.name === remoteQueriesPoolName) return
          return <PoolListItem key={pool.id} pool={pool} />
        })}
    </nav>
  )
}
