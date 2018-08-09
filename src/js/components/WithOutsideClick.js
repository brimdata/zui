import React from "react"
import ReactDOM from "react-dom"

export default function(Component) {
  return class WithOutSideClick extends React.Component {
    constructor(props) {
      super(props)
      this.onDocumentClick = this.onDocumentClick.bind(this)
    }

    componentDidMount() {
      window.document.addEventListener("click", this.onDocumentClick, false)
    }

    componentWillUnmount() {
      window.document.removeEventListener("click", this.onDocumentClick, false)
    }

    onDocumentClick(e) {
      const node = ReactDOM.findDOMNode(this.component)

      if (node && !node.contains(e.target)) {
        this.component.props.onOutsideClick(e)
      }
    }

    render() {
      return <Component ref={r => (this.component = r)} {...this.props} />
    }
  }
}
