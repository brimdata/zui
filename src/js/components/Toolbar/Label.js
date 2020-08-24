/* @flow */
import styled from "styled-components"

import type {Styled} from "../../types/styled"

const Label: Styled<> = styled.label`
  ${(props) => props.theme.typography.labelSmall}
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 3px;
  color: var(--aqua);
`

export default Label
