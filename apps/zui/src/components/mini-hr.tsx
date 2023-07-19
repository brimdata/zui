import styled from "styled-components"

export const MiniHr = styled.hr<{width: number}>`
  width: ${(p) => p.width ?? 32}px;
  height: 4px;
  background-color: var(--primary-color);
  border: none;
  border-radius: 2px;
`
