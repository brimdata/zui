import React from "react"
import mapJoin from "../mapJoin"
import Pin from "../icons/pin-md.svg"
import FilterNode from "./FilterNode"

class Pins extends React.Component {
  constructor(props) {
    super(props)
    this.renderFilter = this.renderFilter.bind(this)
    this.renderJoinOperator = this.renderJoinOperator.bind(this)
  }

  renderFilter(filter, index) {
    return (
      <FilterNode
        key={index}
        filter={filter}
        focused={this.props.editing === index}
        pending={index === null}
        onClick={() => this.props.editSearchBarPin(index)}
        onRemoveClick={e => {
          e.stopPropagation()
          this.props.removeSearchBarPin(index)
        }}
      />
    )
  }

  renderJoinOperator(index) {
    return (
      <p className="join-operator" key={index + "-operator"}>
        AND
      </p>
    )
  }

  renderPinButton() {
    return (
      <button
        className="button pin-filter"
        title="⌘K"
        onClick={this.onPinClick}
      >
        <Pin />
      </button>
    )
  }

  render() {
    const {previousValue, pins} = this.props
    const hasStagedFilter = !/^\s*$/.test(previousValue)
    const hasCommittedFilter = pins.length > 0
    if (!hasStagedFilter && !hasCommittedFilter) return null

    return (
      <div className="pins">
        {mapJoin(pins, this.renderFilter, this.renderJoinOperator)}
        {hasStagedFilter && hasCommittedFilter && this.renderJoinOperator()}
        {hasStagedFilter && this.renderFilter(previousValue, null)}
        {hasStagedFilter && this.renderPinButton()}
      </div>
    )
  }
}

export default Pins
