import React from "react"

import styled from "styled-components"
import {useDispatch, useSelector} from "react-redux"
import Clusters from "../state/Clusters"
import Current from "../state/Current"
import {BrimConnection} from "../brim"
import connection from "../brim/connection"
import DataStoreIcon from "../icons/DataStoreIcon"

const StyledConnection = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 6px;
  border-radius: 3px;
  min-width: 250px;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`

const ConnInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  margin: 0 12px;
`
const ConnName = styled.div`
  ${(p) => p.theme.typography.labelBold};
  color: var(--aqua);
  cursor: default;
`
const ConnAddress = styled.div`
  ${(p) => p.theme.typography.labelSmall};
  color: var(--slate);
  cursor: default;
`

type Props = {
  conn: BrimConnection
  onClick: () => void
}

const Connection = ({conn, onClick}: Props) => {
  return (
    <StyledConnection onClick={onClick}>
      <DataStoreIcon />
      <ConnInfo>
        <ConnName>{conn.name}</ConnName>
        <ConnAddress>{conn.getAddress()}</ConnAddress>
      </ConnInfo>
    </StyledConnection>
  )
}

const PageWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: scroll;
`

const StyledHeader = styled.h1`
  margin: 110px 0 0 0;
  color: var(--aqua);
  ${(p) => p.theme.typography.headingPage}
`

const Connections = styled.ul`
  padding: 0;
`

const ConnectionChooserPage = () => {
  const dispatch = useDispatch()
  const conns = useSelector(Clusters.all)

  return (
    <PageWrap>
      <StyledHeader>Choose a Connection</StyledHeader>
      <Connections>
        {conns.map((c) => (
          <Connection
            key={c.id}
            conn={connection(c)}
            onClick={() => dispatch(Current.setConnectionId(c.id))}
          />
        ))}
      </Connections>
    </PageWrap>
  )
}

export default ConnectionChooserPage
