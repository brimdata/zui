import React from "react"
import {transparentize, cssVar} from "polished"
import {Pool} from "src/app/core/pools/pool"
import styled from "styled-components"

const DataList = styled.div`
  padding: 16px var(--page-padding);
  background: ${transparentize(0.98, cssVar("--foreground-color") as string)};
`

export function PoolDataList({pool}: {pool: Pool}) {
  const keys = pool.keys.map((k) => k.join("."))
  return (
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
  )
}
