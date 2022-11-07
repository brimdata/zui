import {syncPool} from "src/app/core/pools/sync-pool"
import usePoolId from "src/app/router/hooks/use-pool-id"
import useLakeId from "src/app/router/hooks/use-lake-id"
import {poolShow} from "src/app/router/routes"
import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Redirect, Route, Switch} from "react-router"
import Current from "src/js/state/Current"
import {AppDispatch} from "src/js/state/types"
import TabSearchLoading from "src/js/components/TabSearchLoading"
import Ingests from "src/js/state/Ingests"
import {lakePath} from "src/app/router/utils/paths"
import {cssVar, transparentize} from "polished"
import {bytes} from "src/js/lib/fmt"
import styled from "styled-components"
import {useBrimApi} from "../../app/core/context"
import Actions from "../../app/query-home/toolbar/actions/actions"
import LoadFilesInput from "src/ppl/import/LoadFilesInput"

const BG = styled.div`
  --page-padding: 32px;
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
  font-size: 14px;
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
  padding: var(--page-padding);
`

function InitPool({children}) {
  const dispatch = useDispatch<AppDispatch>()
  const poolId = usePoolId()
  const lakeId = useLakeId()
  const pool = useSelector(Current.getPool)
  const ingesting = useSelector(Ingests.isInProgress(pool?.id))

  useEffect(() => {
    if (poolId) dispatch(syncPool(poolId))
  }, [poolId])

  if (!pool) {
    return <Redirect to={lakePath(lakeId)} />
  } else if (ingesting) {
    return <TabSearchLoading />
  } else if (!pool.hasStats()) {
    return null
  } else {
    return children
  }
}

const PoolHome = () => {
  const pool = useSelector(Current.mustGetPool)
  const api = useBrimApi()

  const openNewDraftQuery = () => {
    api.queries.open({
      pins: [{type: "from", value: pool.name}],
      value: "",
    })
  }
  const keys = pool.keys.map((k) => k.join("."))

  return (
    <BG>
      <Header>
        <div>
          <Title>{pool.name}</Title>
          <Subtitle>{bytes(pool.stats.size)}</Subtitle>
        </div>
        <Toolbar>
          <Actions
            actions={[
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
        <LoadFilesContainer>
          <h3>Load Data</h3>
          <label>Add more data to this pool.</label>
          <LoadFilesInput
            onChange={(files) => {
              alert("FILES: " + files.length)
            }}
          />
        </LoadFilesContainer>
      </Body>
    </BG>
  )
}

export default function PoolShow() {
  return (
    <Switch>
      <InitPool>
        <Route path={poolShow.path}>
          <PoolHome />
        </Route>
      </InitPool>
    </Switch>
  )
}
