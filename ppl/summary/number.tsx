import React from "react"
import {createCell} from "src/js/brim/cell"
import styled from "styled-components"

const Num = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--slate);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 24px);
`

export default function Number({record}) {
  const field = record?.getFields()[0]
  if (!field) return null
  return (
    <Num className={field.data.getType()}>{createCell(field).display()}</Num>
  )
}
