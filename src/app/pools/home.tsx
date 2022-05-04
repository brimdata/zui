import {cssVar, transparentize} from "polished"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {lakeQueryPath} from "src/app/router/utils/paths"
import {bytes} from "src/js/lib/fmt"
import Current from "src/js/state/Current"
import Tabs from "src/js/state/Tabs"
import {AppDispatch} from "src/js/state/types"
import styled from "styled-components"
import {newQuery} from "../query-home/flows/new-query"
import Actions from "../query-home/toolbar/actions"

const Header = styled.header`
  padding: 16px;
  display: flex;
  justify-content: space-between;
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
  background: ${transparentize(0.98, cssVar("--foreground-color") as string)};
  padding: 16px;
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

const PoolHome = () => {
  const dispatch = useDispatch<AppDispatch>()
  const pool = useSelector(Current.mustGetPool)
  const lakeId = useSelector(Current.getLakeId)

  const openNewDraftQuery = () => {
    const query = dispatch(newQuery({pins: {from: pool.id, filters: []}}))
    dispatch(Tabs.create(lakeQueryPath(query.id, lakeId)))
  }
  const keys = pool.data.layout.keys.map((k) => k.join("."))

  return (
    <div>
      <Header>
        <div>
          <Title>{pool.name}</Title>
          <Subtitle>{bytes(pool.stats.size)}</Subtitle>
        </div>
        <Actions
          actions={[
            {
              label: "Query Pool",
              icon: "query",
              click: openNewDraftQuery,
              title:
                "Open a new draft query with this pool as the from clause.",
            },
          ]}
        />
      </Header>
      <Body>
        <dl>
          <dt>ID </dt>
          <dd>{pool.id}</dd>
        </dl>
        <dl>
          <dt>Layout Key{keys.length > 1 ? "s" : null} </dt>
          <dd>{keys.join(", ")}</dd>
        </dl>
        <dl>
          <dt>Layout Order </dt>
          <dd>{pool.data.layout.order}</dd>
        </dl>
        <dl>
          <dt>Timestamp </dt>
          <dd>{pool.data.ts.toLocaleString()}</dd>
        </dl>
      </Body>
    </div>
  )
}

export default PoolHome
