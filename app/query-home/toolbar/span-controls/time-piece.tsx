import React, {HTMLProps} from "react"

type Props = {
  children: any
} & HTMLProps<HTMLDivElement>

const TimePiece = ({children, ...rest}: Props) => {
  return (
    <div {...rest} className="time-piece">
      {children}
    </div>
  )
}

export default TimePiece
