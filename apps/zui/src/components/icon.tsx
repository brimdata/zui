import React from "react"
import styles from "./icon.module.css"

type IconName = "play" | "plus"

type Props = {
  name: IconName
  className?: string
  size?: number
  fill?: string
  stroke?: string
}

export default function Icon(props: Props) {
  return (
    <svg className={styles.icon} fill="currentColor">
      <use href={`/icons.svg#${props.name}_line`}></use>
    </svg>
  )
}
