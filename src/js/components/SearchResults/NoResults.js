/* @flow */

import React from "react"

import {Dots} from "../Login/Dots"
import {Fieldset} from "../Typography"

type Props = {width: number}

export default function NoResults({width}: Props) {
  return (
    <div className="no-results" style={{width}}>
      <Fieldset>No Result Data</Fieldset>
    </div>
  )
}
