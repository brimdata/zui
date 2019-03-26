import {CSSTransition} from "react-transition-group"
import React, {Component} from "react"

import {Fieldset} from "./Typography"
import CloseButton from "./CloseButton"
import WithOutsideClick from "./WithOutsideClick"

class ModalContents extends Component {
  render() {
    const {onClose, children, className, title} = this.props
    return (
      <CSSTransition
        classNames="portal-item"
        in={true}
        timeout={{enter: 150}}
        appear
      >
        <div
          className={`modal-contents ${className}`}
          onClick={e => e.stopPropagation()}
        >
          <header className="modal-header">
            <Fieldset>{title}</Fieldset>
            <CloseButton light onClick={onClose} />
          </header>
          <div className="modal-body">{children}</div>
        </div>
      </CSSTransition>
    )
  }
}

export default WithOutsideClick(ModalContents)
