import {syncPool} from "src/models/sync-pool"
import usePoolId from "src/app/router/hooks/use-pool-id"
import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import Current from "src/js/state/Current"
import {AppDispatch} from "src/js/state/types"
import {bytes} from "src/js/lib/fmt"
import styled from "styled-components"
import {poolToolbarMenu} from "src/app/menus/pool-toolbar-menu"
import {NotFound} from "./404"
import {ButtonMenu} from "src/components/button-menu"
import {RecentLoads} from "./recent-loads"
import {Details} from "./details"

const Toolbar = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  height: 42px;
  align-items: center;
  justify-content: flex-end;
`

const Subtitle = styled.p`
  font-size: var(--step-0);
  color: var(--fg-color-less);
  margin: 0;
`

export function InitPool({children}) {
  const dispatch = useDispatch<AppDispatch>()
  const poolId = usePoolId()
  const pool = useSelector(Current.getPool)

  useEffect(() => {
    if (poolId) dispatch(syncPool(poolId))
  }, [poolId])

  if (!pool) {
    return <NotFound />
  } else if (!pool.hasStats()) {
    return null
  } else {
    return children
  }
}

export const Show = () => {
  const pool = useSelector(Current.mustGetPool)
  const menu = poolToolbarMenu(pool)
  const isEmpty = pool.empty()
  return (
    <div className="min-height:full scroll:y">
      <header className="box-1 border:bottom">
        <div className="cluster">
          <div>
            <h1 className="overflow-wrap:anywhere">{pool.name}</h1>
            <Subtitle>
              {isEmpty ? "This pool is empty." : bytes(pool.stats.size)}
            </Subtitle>
          </div>
          <Toolbar>
            <ButtonMenu label={"Pool Menu"} items={menu} />
          </Toolbar>
        </div>
      </header>
      <div className="box-1 stack-3">
        <RecentLoads id={pool.id} />
        <Details pool={pool} />
      </div>
    </div>
  )
}
