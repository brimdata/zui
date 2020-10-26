import React from "react"
import {Cluster} from "../../state/Clusters/types"
import styled from "styled-components"
import StatusLight from "./StatusLight"

const StyledConnectionDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  h1 {
    margin-bottom: 10px;
  }
`

const ConnectionFields = styled.div`
  display: flex;
  background: white;
  flex-direction: column;
  border: 1px solid var(--cloudy);
  border-radius: 10px;
  width: 100%;
`

const FieldWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 12px;
  margin-left: 12px;
  border-bottom: 1px solid var(--cloudy);
  &:last-child {
    border: none;
  }

  label {
    ${(p) => p.theme.typography.labelBold}
  }

  p {
    color: var(--slate);
    ${(p) => p.theme.typography.labelSmall};
  }
`

const Status = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  p {
    text-transform: capitalize;
    margin: 5px;
  }
`

type FieldProps = {
  label: string
  value: string
}

const Field = ({label, value}: FieldProps) => {
  return (
    <FieldWrapper>
      <label>{label}</label>
      <p>{value}</p>
    </FieldWrapper>
  )
}

type Props = {
  conn: Cluster
  spaceCount: number
}

const ConnectionDetail = ({conn, spaceCount}: Props) => {
  const {name, host, port, status, version = "unknown"} = conn
  return (
    <StyledConnectionDetail>
      <h1>{name}</h1>
      <Status>
        <StatusLight status={status} />
        <p>{status}</p>
      </Status>
      <ConnectionFields>
        <Field label="Host" value={[host, port].join(":")} />
        <Field label="ZQD Version" value={version} />
        <Field label="Spaces" value={`${spaceCount}`} />
      </ConnectionFields>
    </StyledConnectionDetail>
  )
}

export default ConnectionDetail
