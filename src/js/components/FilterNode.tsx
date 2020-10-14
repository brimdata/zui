import React, {MouseEvent} from "react"
import styled from "styled-components"
import {CircleCloseButton} from "./CircleCloseButton"
import X from "./icons/x-md.svg"

type Props = {
  filter: string
  focused?: boolean
  pending?: boolean
  onClick?: (e: MouseEvent) => void
  onRemoveClick?: (e: MouseEvent) => void
}

const ButtonWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  .circle {
    color: --wet-cement;
  }
`

export default class FilterNode extends React.PureComponent<Props> {
  render() {
    const classNames = ["filter-node"]
    if (this.props.focused) classNames.push("focused")

    if (this.props.pending) classNames.push("pending")

    return (
      <div className={classNames.join(" ")} onClick={this.props.onClick}>
        <p>{this.props.filter}</p>
        {this.props.onRemoveClick && (
          <ButtonWrap>
            <CircleCloseButton
              onClick={this.props.onRemoveClick}
              className="remove-button"
            />
          </ButtonWrap>
        )}
      </div>
    )
  }
}
