import {syncPool} from "src/app/core/pools/sync-pool"
import usePoolId from "src/app/router/hooks/use-pool-id"
import {poolShow} from "src/app/router/routes"
import React, {useEffect, useRef, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Route, Switch} from "react-router"
import Current from "src/js/state/Current"
import {AppDispatch} from "src/js/state/types"
import {cssVar, transparentize} from "polished"
import {bytes} from "src/js/lib/fmt"
import styled from "styled-components"
import {useBrimApi} from "../../app/core/context"
import Actions from "../../app/query-home/toolbar/actions/actions"
import {loadFiles} from "src/app/commands/pools"
import {useFilesDrop} from "src/util/hooks/use-files-drop"
import classNames from "classnames"
import {DropOverlay} from "src/app/features/sidebar/drop-overlay"
import {DropZone as DropZoneBase} from "src/components/drop-zone"
import {Field} from "src/components/field"
import InputLabel from "src/js/components/common/forms/InputLabel"
import {FileInput} from "src/components/file-input"
import {DataFormatSelect} from "src/components/data-format-select"
import {PoolDataList} from "src/panes/pool-data-list"
import {poolToolbarMenu} from "src/app/menus/pool-toolbar-menu"
import {Title} from "src/components/title"
import {H1} from "src/components/h1"
import {SubmitButton} from "src/components/submit-button"
import {LoadFormat} from "packages/zealot/src"
import {PoolLoadMore, PoolLoadMoreHandle} from "src/panes/pool-load-more"

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
`

const Subtitle = styled.p`
  font-size: 13px;
  opacity: 0.5;
  margin: 0;
`

const Body = styled.section`
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
    return <h1>404</h1>
  } else if (!pool.hasStats()) {
    return null
  } else {
    return children
  }
}

export const Show = () => {
  const pool = useSelector(Current.mustGetPool)
  const loadForm = useRef<PoolLoadMoreHandle>()
  const [{isOver}, dropRef] = useFilesDrop({
    onDrop: (files) => loadForm.current?.submit(files),
  })
  return (
    <BG ref={dropRef} className={classNames({isOver})}>
      <Header>
        <div>
          <H1>{pool.name}</H1>
          <Subtitle>{bytes(pool.stats.size)}</Subtitle>
        </div>
        <Toolbar>
          <Actions actions={poolToolbarMenu.build(pool).template} />
        </Toolbar>
      </Header>
      <Body>
        <PoolDataList pool={pool} />
        <PoolLoadMore pool={pool} ref={loadForm} />
      </Body>
      <DropOverlay show={isOver}>
        <p>Drop To Load Files Into:</p>
        <p>{pool.name}</p>
      </DropOverlay>
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
