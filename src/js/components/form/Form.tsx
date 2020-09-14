import * as React from "react"
import classNames from "classnames"

type Props = {
  children: React.ReactNode
  className?: string
  onSubmit?: Function
}

export default function Form({children, className, onSubmit, ...props}: Props) {
  function onFormSubmit(e) {
    e.preventDefault()
    onSubmit && onSubmit(e)
  }

  return (
    <form
      className={classNames("form ", className)}
      onSubmit={onFormSubmit}
      {...props}
    >
      {children}
    </form>
  )
}
