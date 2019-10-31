/* @flow */

import React from "react"

import {type $Field} from "../../brim"
import Log from "../../models/Log"
import SingleField from "./SingleField"

type Props = {
  field: $Field,
  log: Log,
  menuBuilder: Function
}
export default function CompoundField({field, log, menuBuilder}: Props) {
  let compound = field.toCompound()
  let render = []

  for (let i = 0; i < compound.length; ++i) {
    let item = compound.item(i)
    if (item) {
      let menu = menuBuilder(item, log, true)
      render.push(<SingleField key={i} field={item} log={log} menu={menu} />)
    }
    if (i !== compound.length - 1) {
      render.push(<Separator />)
    }
  }

  return render
}

function Separator() {
  return <div className="compound-field-separator">,</div>
}
