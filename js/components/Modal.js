import React from "react"
import doc from "../doc"
import ReactDOM from "react-dom"

const modalRoot = document.getElementById("modal-root")

export default class Modal extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.handleBodyScroll()
  }

  componentDidUpdate(_props) {
    this.handleBodyScroll()
  }

  render() {
    if (!this.props.isOpen) return null
    const classes = ["modal-wrapper", this.props.extraClasses].join(" ")

    return ReactDOM.createPortal(
      <div className="modal-overlay" onClick={this.props.onDismiss}>
        <div className={classes} onClick={e => e.stopPropagation()}>
          {this.props.children}
        </div>
      </div>,
      modalRoot
    )
  }

  handleBodyScroll() {
    if (this.props.isOpen) doc.noScroll()
    else doc.yesScroll()
  }
}
