import styled from "styled-components"

const Input = styled.div<{isVisible: boolean}>`
  display: flex;
  ${(p) =>
    p.isVisible
      ? `
  flex-direction: row;
  outline: none;
  border: none;
  padding: 0 0 0 8px;
  border-radius: 15px;
  height: 28px;
  line-height: 24px;
  font-size: 13px;
  letter-spacing: 0.8px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1), 0 0 1px 0 rgba(0, 0, 0, 0.77);
  width: 100%;
  position: relative;
  background: var(--coconut);
  align-items: center;
  `
      : `
  flex-direction: column;
  `};
`

export default Input
