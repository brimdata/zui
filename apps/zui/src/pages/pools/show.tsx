import {syncPool} from "src/app/core/pools/sync-pool"
import usePoolId from "src/app/router/hooks/use-pool-id"
import {poolShow} from "src/app/router/routes"
import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Route, Switch} from "react-router"
import Current from "src/js/state/Current"
import {AppDispatch} from "src/js/state/types"
import {bytes} from "src/js/lib/fmt"
import styled from "styled-components"
import {poolToolbarMenu} from "src/app/menus/pool-toolbar-menu"
import {H1} from "src/components/h1"
import {NotFound} from "./404"
import {SubmitButton} from "src/components/submit-button"
import {EmptyPoolPane} from "src/panes/empty-pool-pane"

const BG = styled.div`
  --page-padding: 32px;
  position: relative;
  flex: 1;
`

const Header = styled.header`
  padding: 24px var(--page-padding);
  display: flex;
  justify-content: space-between;
`

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
  const queryPool = poolToolbarMenu.build(pool).items[0]
  return (
    <BG>
      <Header>
        <div>
          <H1>{pool.name}</H1>
          <Subtitle>{bytes(pool.stats.size)}</Subtitle>
        </div>
        <Toolbar>
          <SubmitButton
            icon={queryPool.iconName}
            onClick={() => queryPool.click()}
          >
            Query Pool
          </SubmitButton>
        </Toolbar>
      </Header>
      <Body>
        <EmptyPoolPane />
      </Body>
    </BG>
  )
}

export default function PoolShow() {
  return (
    <Switch>
      <Route path={poolShow.path}>
        <InitPool>
          <Show />
        </InitPool>
      </Route>
    </Switch>
  )
}
