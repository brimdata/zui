import React from "react"
import {useSelector} from "react-redux"
import {Icon} from "src/components/icon"
import {Pool} from "src/models/pool"
import {Item} from "src/views/sidebar/item"
import useLakeId from "src/app/router/hooks/use-lake-id"
import {Content} from "src/js/components/Content"
import {VirtualList} from "src/js/components/virtual-list"
import Pools from "src/js/state/Pools"
import {State} from "src/js/state/types"
import styled from "styled-components"
import {newPool} from "src/domain/pools/handlers"
import {setFromPin} from "src/domain/session/handlers"

const BG = styled.div`
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position-x: 95%;
  background-position-y: 250px;
  padding-left: 10%;
  padding-top: 50px;
  overflow: auto;
  display: flex;
  flex-direction: column;
`

const Message = styled(Content)`
  margin-top: 30px;
  width: 320px;
`

const Card = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  width: 320px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 0 0 1px var(--border-color);
  flex: 1;
  margin-bottom: 30px;
`

export function isMissingPoolError(e: unknown) {
  return typeof e === "string" && /no pool name given/.test(e)
}

function PoolsList({pools}: {pools: Pool[]}) {
  const rowHeight = 32

  return (
    <Card style={{maxHeight: rowHeight * pools.length + 20 + "px"}}>
      <VirtualList
        items={pools}
        rowHeight={rowHeight}
        paddingTop={10}
        paddingBottom={10}
        innerProps={{"aria-label": "from-pin-list"}}
      >
        {(props) => {
          return (
            <Item
              text={props.item.name}
              style={props.style}
              icon={<Icon name="pool" />}
              onClick={() => setFromPin(props.item.name)}
              aria={props.aria}
            />
          )
        }}
      </VirtualList>
    </Card>
  )
}

function NoPoolsMessage() {
  return (
    <>
      <Message>
        {
          "You don't have any pools yet. Load data into a pool to start querying."
        }
      </Message>
      <Message>
        <button onClick={() => newPool()}>Create Pool</button>
      </Message>
    </>
  )
}

function SomePoolsMessage(props: {pools: Pool[]}) {
  return (
    <>
      <Message>
        {
          "Add a from clause to your query, or click one of the pools below to create a 'from' pin in your query."
        }
      </Message>
      <PoolsList pools={props.pools} />
    </>
  )
}

export function MissingPoolError() {
  const lakeId = useLakeId()
  const pools = useSelector((state: State) => Pools.all(state, lakeId))
  return (
    <BG>
      <h1>No Pool Specified</h1>
      {pools.length ? <SomePoolsMessage pools={pools} /> : <NoPoolsMessage />}
    </BG>
  )
}
