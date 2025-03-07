import styled from "styled-components"

export const Content = styled.div`
  flex: 1;
  position: relative;
  min-height: 0;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 1px;
    box-shadow: inset 0 0.5px 0 0 var(--border-color);
    opacity: 0.12;
  }
`
