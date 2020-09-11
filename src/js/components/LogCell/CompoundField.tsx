import React from "react"
import classNames from "classnames"

import {$Field} from "../../brim"
import Log from "../../models/Log"
import SingleField from "./SingleField"

type Props = {
  field: $Field
  log: Log
  menuBuilder: Function
}

export default function CompoundField({field, log, menuBuilder}: Props) {
  const compound = field.toCompound()
  const render = []

  for (let i = 0; i < compound.length; ++i) {
    const item = compound.item(i)
    if (item) {
      const menu = menuBuilder(item, log, true)
      render.push(<SingleField key={i} field={item} menu={menu} />)
    }
    if (i !== compound.length - 1) {
      render.push(<Comma key={"comma-" + i} />)
    }
  }

  return <Wrapper type={compound.container}>{render}</Wrapper>
}

function Comma() {
  return <Extra value="," className="separator" />
}

function Extra({value, className}: {value: string | null; className?: string}) {
  return (
    <div className={classNames("compound-field-extra", className)}>{value}</div>
  )
}

type WrapperProps = {
  type: string | null
  children: any
}

function Wrapper({type, children}: WrapperProps) {
  const [open, close] = getWrapper(type)
  return (
    <>
      <Extra value={open} />
      {children}
      <Extra value={close} />
    </>
  )
}

function getWrapper(container) {
  switch (container) {
    case "set":
      return ["{", "}"]
    case "vector":
      // DELETE after vector-array is merged
      return ["[", "]"]
    case "array":
      return ["[", "]"]
    default:
      return [null, null]
  }
}
