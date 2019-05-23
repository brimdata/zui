/* @flow */
import {isEmpty} from "lodash"
import React from "react"

import {Mono} from "../Typography"
import type {SearchRecord} from "../../types"

type Props = {search: SearchRecord}

export default function FindingProgram({search}: Props) {
  if (isEmpty(search.pins) && isEmpty(search.program))
    return (
      <div className="program">
        <Mono>*</Mono>
      </div>
    )

  return (
    <div className="program">
      {search.pins.map((text, i) => (
        <Mono className="pin" key={i}>
          {text}
        </Mono>
      ))}
      <Mono>{search.program}</Mono>
    </div>
  )
}
