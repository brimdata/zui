import React from "react"
import FileBorderSvg from "../../static/icons/file-border"

export default function FileBorder(props: any) {
  return (
    <FileBorderSvg
      {...props}
      fill={"var(--primary-color)"}
      stroke={"var(--primary-color)"}
    />
  )
}
