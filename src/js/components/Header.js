import React from "react"
import XSearchBar from "../connectors/XSearchBar"
import XTimeControls from "../connectors/XTimeControls"
import Arrow from "../icons/chevron-top-md.svg"
import classNames from "classnames"

class Header extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {showToggle: false, isExpanded: true}
    this.onMouseOver = () => this.setState({showToggle: true})
    this.onMouseOut = () => this.setState({showToggle: false})
    this.onToggleClick = () =>
      this.setState({isExpanded: !this.state.isExpanded})
  }

  render() {
    const buttonClasses = classNames("collapse-button", {
      visible: this.state.showToggle,
      expand: !this.state.isExpanded
    })

    return (
      <div
        className="header-wrapper"
        onMouseOut={this.onMouseOut}
        onMouseOver={this.onMouseOver}
      >
        <section className="search-area">
          <XSearchBar />
        </section>

        {!this.props.initialLoad &&
          (this.state.isExpanded && <XTimeControls />)}

        {!this.props.initialLoad && (
          <div className={buttonClasses} onClick={this.onToggleClick}>
            <Arrow />
          </div>
        )}
      </div>
    )
  }
}

export default Header
