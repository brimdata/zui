import getPoolContextMenu from "app/pools/flows/get-pool-context-menu"
import {lakeSearchPath} from "app/router/utils/paths"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {useHistory} from "react-router"
import {currentPoolItem, poolItem} from "test/playwright/helpers/locators"
import brim from "src/js/brim"
import Current from "src/js/state/Current"
import {AppDispatch} from "src/js/state/types"
import ProgressIndicator from "src/js/components/ProgressIndicator"
import {ItemBG, Rename, Name, StyledItem} from "../common"
import styled from "styled-components"
import Icon from "app/core/Icon"
import classNames from "classnames"
import {showContextMenu} from "src/js/lib/System"
import {MenuItemConstructorOptions} from "electron"

const PoolIcon = styled(Icon).attrs({name: "pool"})``

const StyledPoolItem = styled(StyledItem)<{isSelected: boolean}>`
  ${({isSelected}) =>
    isSelected &&
    `
  outline: none;
  color: white;
  background: var(--havelock);
  `}

  ${PoolIcon} > svg {
    margin-right: 8px;
    width: 14px;
    height: 14px;
    fill: ${(p) => (p.isSelected ? "white" : "inherit")};
    stroke: ${(p) => (p.isSelected ? "white" : "inherit")};
  }

  ${Name} {
    color: ${(p) => (p.isSelected ? "white" : "black")};
  }
`

const PoolItem = ({innerRef, styles, data: pool, state, handlers}) => {
  const dispatch = useDispatch<AppDispatch>()
  const workspaceId = useSelector(Current.getWorkspaceId)
  const currentPoolId = useSelector(Current.getPoolId)
  const history = useHistory()
  const {isEditing} = state
  const p = brim.pool(pool)
  const ctxMenu: MenuItemConstructorOptions[] = [
    {
      label: "Rename",
      click: () => {
        handlers.edit()
      }
    },
    ...dispatch(getPoolContextMenu(p))
  ]

  const onClick = (e) => {
    e.preventDefault()
    history.push(
      lakeSearchPath(p.id, workspaceId, {
        spanArgs: p.empty() ? undefined : p.defaultSpanArgs()
      })
    )
  }

  const progress = p.ingesting() && (
    <div className="small-progress-bar">
      <ProgressIndicator percent={p.ingestProgress()} />
    </div>
  )
  const isCurrent = p.id === currentPoolId
  const testProps = isCurrent ? currentPoolItem.props : poolItem.props

  return (
    <ItemBG
      tabIndex={0}
      ref={innerRef}
      style={styles.row}
      className={classNames(state)}
      onClick={onClick}
      onContextMenu={() => showContextMenu(ctxMenu)}
      {...testProps}
    >
      <StyledPoolItem isSelected={isCurrent}>
        <PoolIcon />
        {isEditing ? (
          <Rename item={pool} onSubmit={handlers.submit} />
        ) : (
          <Name>{pool.name}</Name>
        )}
        {progress}
      </StyledPoolItem>
    </ItemBG>
  )
}

export default PoolItem
