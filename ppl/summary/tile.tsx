import useSearch from "app/core/hooks/useSearch"
import React, {forwardRef} from "react"
import styled, {keyframes} from "styled-components"
import BarChart from "./bar-chart"
import Table from "./table"
import {ParentSize} from "@vx/responsive"
import HorizontalBarChart from "./horizontal-bar-chart"
import {useDispatch, useSelector} from "react-redux"
import Current from "src/js/state/Current"
import Number from "./number"
import {TileFormat} from "./summary"
import Tab from "src/js/state/Tab"
import Icon from "app/core/Icon"
import {showContextMenu} from "src/js/lib/System"
import SearchBar from "src/js/state/SearchBar"
import {submitSearch} from "src/js/flows/submitSearch/mod"
import Layout from "src/js/state/Layout"
import {removeHeadProc} from "src/js/lib/Program"

const Wrap = styled.div``

const Menu = styled.div`
  position: relative;
  padding: 6px;
  svg {
    width: 12px;
    height: 12px;
    z-index: 1;
    fill: var(--slate);
  }
  &:before {
    content: "";
    background: var(--hover-light-bg);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transform: scale(0);
    transition: transform 100ms;
  }
  &:hover:before {
    transform: scale(1);
  }
`

const BG = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 3px;
  background: white;
  display: flex;
  flex-direction: column;
  text {
    fill: var(--slate);
  }

  .react-resizable-handle {
    // static for now
    opacity: 0;
  }

  ${Menu} {
    transition: opacity 100ms;
    opacity: 0;
  }

  &:hover ${Menu} {
    opacity: 1;
  }
`

const Title = styled.h2`
  ${(p) => p.theme.typography.headingList}
  font-size: 8px;
  color: var(--slate);
  cursor: default;
  margin: 0;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 6px 6px 18px 12px;
`

const Content = styled.div`
  flex: 1;
  overflow: hidden;
  padding: 0 12px 12px 12px;
  animation: fadein 200ms;
`

const showMenu = (query) => (dispatch) => {
  showContextMenu([
    {
      label: "Show all records",
      click() {
        dispatch(SearchBar.changeSearchBarInput(removeHeadProc(query)))
        dispatch(Layout.setMainView("search"))
        dispatch(submitSearch())
      }
    }
  ])
}

const loading = keyframes`
  0% { background-position: -500px 0; }
  100% { background-position: 500px 0; }
`

const Row = styled.div`
  height: 22px;
  width: 100%;
  border-radius: 1px;
  background: linear-gradient(
    to right,
    var(--table-stripe-bg) 10%,
    var(--hover-light-bg) 50%,
    var(--table-stripe-bg) 90%
  );
  animation: ${loading} 1s linear infinite;
  background-size: 1000px 22px;
  &:nth-child(even) {
    background: none;
  }
  position: relative;
`

const BGTable = styled.div`
  animation: fadein 200ms;
  padding: 12px;
`

const TableSkeleton = () => {
  return (
    <BGTable>
      {Array(10)
        .fill(0)
        .map((_, i) => {
          return <Row key={i} />
        })}
    </BGTable>
  )
}

type Props = {
  title: string
  query: string
  format: TileFormat
}

const Tile = forwardRef<HTMLDivElement, Props>(function Tile(
  {title, query, format, children, ...rest},
  ref
) {
  const dispatch = useDispatch()
  const space = useSelector(Current.getSpace)
  const span = useSelector(Tab.getSpan)
  const [records, isFetching] = useSearch(query, [space, span])
  return (
    <Wrap ref={ref} {...rest}>
      <BG>
        <Header>
          <Title>{title}</Title>
          <Menu onClick={() => dispatch(showMenu(query))}>
            <Icon name="three-dots" />
          </Menu>
        </Header>

        {isFetching ? (
          <TableSkeleton />
        ) : (
          <Content>
            <Format format={format} records={records} />
          </Content>
        )}
        {/*  For react-grid-layout to add the resize handle */}
        {children}
      </BG>
    </Wrap>
  )
})

const Format = React.memo(function Format({format, records}) {
  switch (format.type) {
    case "bar-chart":
      return (
        <ParentSize>
          {({width, height}) => (
            <BarChart
              records={records}
              width={width}
              height={height}
              x={format.x}
              y={format.y}
            />
          )}
        </ParentSize>
      )
    case "horizontal-bar-chart":
      return (
        <ParentSize>
          {() => (
            <HorizontalBarChart
              records={records}
              width={200}
              height={200}
              x={format.x}
              y={format.y}
            />
          )}
        </ParentSize>
      )
    case "table":
      return <Table records={records} x={format.x} />
    case "number":
      return <Number record={records[0]} />
    default:
      return null
  }
})

export default Tile
