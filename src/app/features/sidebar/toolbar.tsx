import styled from "styled-components"

export const Toolbar = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 1px;
    box-shadow: inset 0 0.5px 0 0 var(--aqua);
    opacity: 0.12;
  }
`
