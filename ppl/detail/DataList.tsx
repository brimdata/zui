import {zng} from "zealot"
import React from "react"

type Props = {fields: zng.Field[]}

export default function DataList({fields}: Props) {
  return (
    <div>
      {fields.map((field, i) => (
        <dl key={i}>
          <dt>{field.name}</dt>
          <dd>{field.data.getValue()}</dd>
        </dl>
      ))}
    </div>
  )
}
