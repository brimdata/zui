/* @flow */

import React from "react"

import {cssVar} from "../lib/cssVar"
import FileBorderSvg from "../../static/icons/file-border.svg"

const blue = cssVar("--azure")

export default function FileBorder(props: *) {
  return <FileBorderSvg {...props} fill={blue} stroke={blue} />
}
