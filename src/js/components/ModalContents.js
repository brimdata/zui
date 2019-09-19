/* @flow */
import React, {Component} from "react"
import classNames from "classnames"

import CloseButton from "./CloseButton"
import WithOutsideClick from "./WithOutsideClick"

type Props = {
  onClose: Function,
  children: *,
  className: string,
  title: string,
  width: number | string
}

class ModalContents extends Component<Props> {
  render() {
    const {onClose, children, className, title, width} = this.props
    return (
      <div
        className={classNames("modal-contents", className)}
        onClick={(e) => e.stopPropagation()}
        style={{width}}
      >
        <CloseButton light onClick={onClose} />
        <h2 className="modal-header">{title}</h2>
        <div className="modal-body">{children}</div>
      </div>
    )
  }
}

export default WithOutsideClick(ModalContents)
