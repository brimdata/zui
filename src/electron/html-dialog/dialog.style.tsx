import styled from "styled-components"

export const BG = styled.div`
  padding: 22px;
  font-family: system-ui;
  height: 100%;
  width: 100%;
  overflow: hidden;

  .icon {
    padding: 0 22px;
    opacity: 0.33;
    svg {
      width: 60px;
      height: 60px;
    }
  }

  main {
    font-size: 14px;
    letter-spacing: 0.2px;
    display: flex;
  }

  h1 {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.2px;
  }

  footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 22px;
    text-align: right;
  }
`
