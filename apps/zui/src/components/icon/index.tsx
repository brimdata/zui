import React from "react"
import styles from "./icon.module.css"
import {IconName as Name, customIconNames, iconNames} from "./icon-names"
import classNames from "classnames"

type Props = {
  name: Name
  className?: string
  size?: number
  fill?: string
  stroke?: string
}

const style: "line" | "fill" = "line"

export function Icon(props: Props) {
  const customName = customIconNames[props.name]
  const name = iconNames[props.name]
  const path = customName
    ? `/custom-icons.svg#${customName}`
    : `/icons.svg#${name}_${style}`

  return (
    <svg className={classNames("icon", styles.icon)} fill={"currentColor"}>
      <use href={path}></use>
    </svg>
  )
}

export type IconName = Name
