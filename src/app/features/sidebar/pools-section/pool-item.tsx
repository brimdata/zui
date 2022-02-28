import getPoolContextMenu from "src/app/pools/flows/get-pool-context-menu"
import {lakePoolPath} from "src/app/router/utils/paths"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {useHistory} from "react-router"
import Current from "src/js/state/Current"
import {AppDispatch} from "src/js/state/types"
import ProgressIndicator from "src/js/components/ProgressIndicator"
import {ItemBG, Rename, Name, StyledItem} from "../common"
import styled from "styled-components"
import Icon from "src/app/core/Icon"
import classNames from "classnames"
import {showContextMenu} from "src/js/lib/System"
import {MenuItemConstructorOptions} from "electron"
import {Pool} from "src/app/core/pools/pool"
import Ingests from "src/js/state/Ingests"
import {isNumber} from "lodash"

const PoolIcon = styled(Icon).attrs({name: "pool"})``

const StyledPoolItem = styled(StyledItem)<{isSelected: boolean}>`
  ${({isSelected}) =>
    isSelected &&
    `
  outline: none;
  color: white;
  background: var(--havelock);
  &:hover {
    background: var(--havelock);
    opacity: 0.85;
  }
  `}

  ${PoolIcon} > svg {
    margin-right: 8px;
    width: 14px;
    height: 14px;

    path {
      fill: ${(p) => (p.isSelected ? "white" : "inherit")};
    }
  }

  ${Name} {
    color: ${(p) => (p.isSelected ? "white" : "black")};
  }
`

const PoolItem = ({innerRef, styles, data, state, handlers}) => {
  const pool = data as Pool
  const dispatch = useDispatch<AppDispatch>()
  const lakeId = useSelector(Current.getLakeId)
  const currentPoolId = useSelector(Current.getPoolId)
  const ingest = useSelector(Ingests.get(currentPoolId))
  const history = useHistory()
  const {isEditing} = state
  const ctxMenu: MenuItemConstructorOptions[] = [
    {
      label: "Rename",
      click: () => {
        handlers.edit()
      }
    },
    ...dispatch(getPoolContextMenu(pool))
  ]

  const onClick = (e) => {
    e.preventDefault()
    history.push(lakePoolPath(pool.id, lakeId))
  }

  const progress = ingest && isNumber(ingest.progress) && (
    <div className="small-progress-bar">
      <ProgressIndicator percent={ingest.progress} />
    </div>
  )
  const isCurrent = pool.id === currentPoolId

  return (
    <ItemBG
      tabIndex={0}
      ref={innerRef}
      style={styles.row}
      className={classNames(state)}
      onClick={onClick}
      onContextMenu={() => showContextMenu(ctxMenu)}
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
