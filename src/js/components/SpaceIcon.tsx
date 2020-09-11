import React from "react"

import ArchiveBorderIcon from "../icons/ArchiveBorderIcon"
import FileBorder from "../icons/FileBorder"
import SubspaceBorderIcon from "../icons/SubspaceBorderIcon"

type Props = {
  type: "archive" | "subspace" | "space"
  className?: string
}

export default function SpaceIcon({type, ...rest}: Props) {
  switch (type) {
    case "archive":
      return <ArchiveBorderIcon {...rest} />
    case "subspace":
      return <SubspaceBorderIcon {...rest} />
    default:
      return <FileBorder {...rest} />
  }
}
