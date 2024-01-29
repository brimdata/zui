import {syncPool} from "src/app/core/pools/sync-pool"
import usePoolId from "src/app/router/hooks/use-pool-id"
import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import Current from "src/js/state/Current"
import {AppDispatch} from "src/js/state/types"
import {bytes} from "src/js/lib/fmt"
import styled from "styled-components"
import {poolToolbarMenu} from "src/app/menus/pool-toolbar-menu"
import {H1} from "src/components/h1"
import {NotFound} from "./404"
import {ButtonMenu} from "src/components/button-menu"
import {RecentLoads} from "./recent-loads"
import {Details} from "./details"
import styles from "./index.module.css"
import classNames from "classnames"

const Toolbar = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  height: 42px;
  align-items: center;
  justify-content: flex-end;
`

const Subtitle = styled.p`
  font-size: 13px;
  opacity: 0.5;
  margin: 0;
`

const Body = styled.section`
  height: 100%;
  h4 {
    margin-bottom: 6px;
    opacity: 0.6;
  }
  dt {
    font-weight: bold;
  }
  dd {
    margin-bottom: 6px;
    font-family: var(--mono-font);
  }
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
    <div className={styles.page}>
      <header className="box-1 border:bottom">
        <div className="cluster">
          <div>
            <H1 className="overflow-wrap:anywhere">{pool.name}</H1>
            <Subtitle>
              {isEmpty ? "This pool is empty." : bytes(pool.stats.size)}
            </Subtitle>
          </div>
          <Toolbar>
            <ButtonMenu label={"Pool Menu"} items={menu} />
          </Toolbar>
        </div>
      </header>
      <Body>
        <RecentLoads id={pool.id} />
        <Details pool={pool} />
      </Body>
    </div>
  )
}
