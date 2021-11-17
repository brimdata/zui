import {FixedSizeList} from "react-window"
import styled from "styled-components"

export const List = styled(FixedSizeList)`
  font-size: 13px;
  font-family: "Cartograph", sans-serif;
  line-height: 18px;

  .inspector-row {
    white-space: nowrap;
  }

  .inspector-string {
    color: var(--azure);
  }

  .inspector-key {
    color: var(--pecan);
  }

  .inspector-ip {
    color: var(--ip);
  }

  .inspector-int {
    color: var(--count);
  }

  a {
    cursor: pointer;
  }

  .inspector-expanded svg,
  .inspector-collapsed svg {
    opacity: 0.6;
    width: 8px;
    height: 8px;
    fill: var(--aqua);
  }

  .inspector-expanded svg {
    transform: rotateZ(90deg);
  }
`
