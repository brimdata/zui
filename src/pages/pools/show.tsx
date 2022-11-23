import {syncPool} from "src/app/core/pools/sync-pool"
import usePoolId from "src/app/router/hooks/use-pool-id"
import {poolShow} from "src/app/router/routes"
import React, {useEffect, useRef} from "react"
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

const Title = styled.h1`
  font-weight: bold;
  font-size: 18px;
  margin: 0;
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

const DataList = styled.div`
  padding: 16px var(--page-padding);
  background: ${transparentize(0.98, cssVar("--foreground-color") as string)};
`

const LoadFilesContainer = styled.div`
  margin: var(--page-padding);
  padding: var(--page-padding);
  height: 100px;
  border: 2px dashed var(--border-color);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  label {
    opacity: 0.5;
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
  const api = useBrimApi()

  const openNewDraftQuery = () => {
    api.queries.open({
      pins: [{type: "from", value: pool.name}],
      value: "",
    })
  }
  const keys = pool.keys.map((k) => k.join("."))
  const [{isOver}, dropRef] = useFilesDrop({
    onDrop: (files) => loadFiles.run(pool.id, files),
  })
  const fileInput = useRef<HTMLInputElement>()

  return (
    <BG ref={dropRef} className={classNames({isOver})}>
      <DropOverlay show={isOver}>
        <p>Drop To Load Files Into:</p>
        <p>{pool.name}</p>
      </DropOverlay>
      <Header>
        <div>
          <Title>{pool.name}</Title>
          <Subtitle>{bytes(pool.stats.size)}</Subtitle>
        </div>
        <Toolbar>
          <input
            type="file"
            multiple
            style={{display: "none"}}
            ref={fileInput}
            onChange={(e) =>
              loadFiles.run(pool.id, Array.from(e.currentTarget.files))
            }
          />
          <Actions
            actions={[
              {
                label: "Load Data",
                icon: "doc-plain",
                click: () => {
                  fileInput.current?.click()
                },
                title: "Load more data into this pool.",
              },
              {
                label: "Query Pool",
                icon: "query",
                click: openNewDraftQuery,
                title:
                  "Open a new session query with this pool as the from clause.",
              },
            ]}
          />
        </Toolbar>
      </Header>
      <Body>
        <DataList>
          <dl>
            <dt>ID </dt>
            <dd>{pool.id}</dd>
          </dl>
          <dl>
            <dt>Layout Key{keys.length > 1 ? "s" : null} </dt>
            <dd>{keys.join(", ") || "null"}</dd>
          </dl>
          <dl>
            <dt>Layout Order </dt>
            <dd>{pool.data.layout.order}</dd>
          </dl>
          <dl>
            <dt>Timestamp </dt>
            <dd>{pool.data.ts.toLocaleString()}</dd>
          </dl>
        </DataList>
        {!isOver && (
          <LoadFilesContainer>
            <label>Drag and drop files to load more data into this pool.</label>
          </LoadFilesContainer>
        )}
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
