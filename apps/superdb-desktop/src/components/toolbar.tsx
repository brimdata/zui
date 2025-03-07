import styled from "styled-components"

export const Toolbar = styled.div<{reverse?: boolean}>`
  border-bottom: 1px solid var(--border-color-more);
  display: flex;
  flex-direction: ${(props) => (props.reverse ? "row-reverse" : "row")};
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  flex-shrink: 0;
  flex-grow: 0;
  height: 37px;
  overflow: hidden;
`
