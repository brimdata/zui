import classNames from "classnames"
import React from "react"
import {Case} from "src/components/case"

type Props = {
  percent: number
  className?: string
}

export default function ProgressIndicator({percent, ...rest}: Props) {
  const style = {
    width: Math.floor(percent * 100) + "%",
  }
  return (
    <div {...rest} className={classNames("progress-indicator", rest.className)}>
      <div className="progress-track">
        <Case
          if={percent === Infinity}
          true={<div className="progress-fill progress-indeterminate" />}
          false={<div className="progress-fill" style={style} />}
        />
      </div>
    </div>
  )
}
