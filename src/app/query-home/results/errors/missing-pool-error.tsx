import React from "react"
import {useSelector} from "react-redux"
import {newPool} from "src/app/commands/new-pool"
import {createFrom} from "src/app/commands/pins"
import Icon from "src/app/core/icon-temp"
import {Pool} from "src/app/core/pools/pool"
import {Item} from "src/app/features/sidebar/item"
import useLakeId from "src/app/router/hooks/use-lake-id"
import {Content} from "src/js/components/Content"
import {VirtualList} from "src/js/components/virtual-list"
import Pools from "src/js/state/Pools"
import styled from "styled-components"
import {Button} from "../../title-bar/button"

const BG = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(dist/static/pool-wall-background.svg);
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
  background: white;
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
  return e === "pool name missing"
}

function PoolsList({pools}: {pools: Pool[]}) {
  const rowHeight = 26

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
              onClick={() => createFrom.run(props.item.name)}
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
        <Button onClick={() => newPool.run()}>Create Pool</Button>
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
  const pools = useSelector((state) => Pools.all(state, lakeId))
  return (
    <BG>
      <h1>No Pool Specified</h1>
      {pools.length ? <SomePoolsMessage pools={pools} /> : <NoPoolsMessage />}
    </BG>
  )
}
