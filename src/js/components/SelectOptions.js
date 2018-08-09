import React from "react"
import WithOutsideClick from "./WithOutsideClick"

class SelectOptions extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {isOpen: false, selected: null}
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.select = this.select.bind(this)
    this.hover = this.hover.bind(this)
  }

  open() {
    this.setState({isOpen: true, selected: this.props.value})
  }

  close() {
    this.setState({isOpen: false})
  }

  select(value) {
    this.setState({selected: value, isOpen: false})
    this.props.onSelect(value)
  }

  hover() {
    this.setState({selected: null})
  }

  render() {
    return (
      <div className="select-options-wrapper">
        <div className="label" onClick={this.open}>
          {this.props.children}
        </div>
        {this.state.isOpen && (
          <Options onOutsideClick={this.close}>
            {this.props.options.map(o => (
              <Option
                key={o}
                value={o}
                selected={o === this.state.selected}
                onMouseEnter={this.hover}
                onClick={() => this.select(o)}
              />
            ))}
          </Options>
        )}
      </div>
    )
  }
}

class BaseOptions extends React.PureComponent {
  render() {
    return <ul className="select-options">{this.props.children}</ul>
  }
}
const Options = WithOutsideClick(BaseOptions)

const Option = props => {
  return (
    <li
      className={`option ${props.selected ? "selected" : ""}`}
      onClick={props.onClick}
      onMouseEnter={props.onMouseEnter}
    >
      {props.value}
    </li>
  )
}

export default SelectOptions
