import {formatPrimitive} from "app/core/formatters/format-zed"
import {typeClassNames} from "app/core/utils/type-class-names"
import React from "react"
import styled from "styled-components"
import {zed} from "zealot"

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
  const field = record?.getFields()[0] as zed.Field
  if (!field) return null
  return (
    <Num className={typeClassNames(field.data)}>
      {formatPrimitive(field.data as zed.Primitive)}
    </Num>
  )
}
