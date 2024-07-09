import styled from "styled-components"

export const TableWrap = styled.div`
  padding-bottom: 4px;
`

export const Caption = styled.p`
  ${(p) => p.theme.typography.labelSmall}
  font-style: italic;
  text-align: right;
  color: var(--fg-color-less);
  margin-right: 4px;
`
