import React from "react"
import SelectOptions from "./SelectOptions"
import Arrow from "../icons/chevron-bottom-md.svg"

class SpaceSwitcher extends React.PureComponent {
  render() {
    return (
      <div className="space-switcher">
        <h3 className="tiny-heading">Space</h3>
        <SelectOptions
          value={this.props.currentSpaceName}
          options={Object.keys(this.props.spaces)}
          onSelect={this.props.onSelect}
        >
          <p className="current-space-name">
            {this.props.currentSpaceName}
            <Arrow />
          </p>
        </SelectOptions>
      </div>
    )
  }
}

export default SpaceSwitcher
