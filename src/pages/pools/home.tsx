import {cssVar, transparentize} from "polished"
import React from "react"
import {useSelector} from "react-redux"
import {bytes} from "src/js/lib/fmt"
import Current from "src/js/state/Current"
import styled from "styled-components"
import {useBrimApi} from "../../app/core/context"
import Actions from "../../app/query-home/toolbar/actions/actions"

const Header = styled.header`
  padding: 16px;
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
    <div>
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
      </Body>
    </div>
  )
}

export default PoolHome
