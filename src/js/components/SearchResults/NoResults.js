/* @flow */

import React from "react"

import {Fieldset} from "../Typography"

type Props = {width: number}

export default function NoResults({width}: Props) {
  return (
    <div className="no-results" style={{width}}>
      <Fieldset>No Result Data</Fieldset>
    </div>
  )
}
