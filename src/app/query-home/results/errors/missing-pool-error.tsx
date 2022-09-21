import React from "react"
import {useSelector} from "react-redux"
import {createFrom} from "src/app/commands/pins"
import Icon from "src/app/core/icon-temp"
import {Item} from "src/app/features/sidebar/item"
import useLakeId from "src/app/router/hooks/use-lake-id"
import {Content} from "src/js/components/Content"
import {useScrollShadow} from "src/js/components/hooks/use-scroll-shadow"
import {VirtualList} from "src/js/components/virtual-list"
import Pools from "src/js/state/Pools"
import styled from "styled-components"

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
  overflow-x: visible;
  border-radius: 8px;
  box-shadow: 0 22px 80px hsla(0 0% 72% / 0.8);
  flex: 1;
  margin-bottom: 30px;
`

export function isMissingPoolError(e: unknown) {
  return e === "pool name missing"
}

export function MissingPoolError() {
  const lakeId = useLakeId()
  const pools = useSelector((state) => Pools.all(state, lakeId))
  const scroll = useScrollShadow()
  const rowHeight = 26
  return (
    <BG ref={scroll}>
      <h1>No Pool Specified</h1>
      <Message>
        {
          "Add a from clause to your query, or click one of the pools below to create a 'from' pin in your query."
        }
      </Message>

      <Card style={{maxHeight: rowHeight * pools.length + 20 + "px"}}>
        <VirtualList
          items={pools}
          rowHeight={rowHeight}
          paddingTop={10}
          paddingBottom={10}
        >
          {(props) => {
            return (
              <Item
                text={props.item.name}
                style={props.style}
                icon={<Icon name="pool" />}
                onClick={() => createFrom.run(props.item.name)}
              />
            )
          }}
        </VirtualList>
      </Card>
    </BG>
  )
}
