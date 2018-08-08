import React from "react"

export default class TextInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {focused: false}
  }

  focus() {
    this.input.focus()
  }

  render() {
    const classNames = ["text-input-wrapper"]
    if (this.state.focused) classNames.push("focused")
    if (this.props.value.length > 0) classNames.push("has-content")

    return (
      <div className={classNames.join(" ")}>
        <input
          placeholder="Search"
          autoFocus={this.props.autoFocus}
          autoComplete={this.props.autoComplete}
          spellCheck={this.props.spellCheck}
          value={this.props.value}
          ref={r => (this.input = r)}
          onChange={this.props.onChange}
          onKeyDown={this.props.onKeyDown}
          onBlur={this.props.onBlur}
          onFocus={() => this.setState({focused: true})}
          type="text"
        />
        {this.props.isFetching && (
          <div className="spin-loader-wrapper">
            <div className="spin-loader" />
          </div>
        )}
      </div>
    )
  }
}
