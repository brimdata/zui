import styled from "styled-components"

export const Content = styled.section`
  line-height: 1.6;

  a {
    color: var(--havelock);
    text-decoration: underline;
    cursor: pointer;
  }

  hr {
    border: none;
    border-top: 1px solid var(--cloudy);
  }

  * {
    margin: 0.5em 0;
  }

  li {
    margin: 0.1em 0;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
`
