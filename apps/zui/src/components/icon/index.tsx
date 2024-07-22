import React from "react"
import styles from "./icon.module.css"
import {IconName as Name, customIconNames, iconNames} from "./icon-names"
import classNames from "classnames"

type Props = {
  name: Name
  className?: string
  size?: string
  fill?: string
  stroke?: string
}

const iconStyle: "line" | "fill" = "line"

export function Icon(props: Props) {
  const customName = customIconNames[props.name]
  const name = iconNames[props.name]
  const path = customName
    ? `/custom-icons.svg#${customName}`
    : `/icons.svg#${name}_${iconStyle}`
  const style = props.size ? {width: props.size, height: props.size} : undefined

  return (
    <svg
      className={classNames("icon", styles.icon, props.className)}
      fill={props.fill || "currentColor"}
      style={style}
    >
      <use href={path}></use>
    </svg>
  )
}

export type IconName = Name
