/* @flow */
import React from "react"
import classNames from "classnames"

import {Fieldset} from "./Typography"

export default function EmptyMessage({show}: {show: boolean}) {
  return (
    <Fieldset className={classNames("no-chart-data", {visible: show})}>
      No Chart Data
    </Fieldset>
  )
}
