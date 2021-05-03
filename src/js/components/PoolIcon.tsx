import React from "react"

import FileBorder from "../icons/FileBorder"

type Props = {
  className?: string
}

export default function PoolIcon({...rest}: Props) {
  return <FileBorder {...rest} />
}
