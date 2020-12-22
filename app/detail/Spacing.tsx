import styled from "styled-components"

export const ChartWrap = styled.div`
  padding: 12px;
`

export const TableWrap = styled.div`
  padding-bottom: 4px;
`

export const Caption = styled.p`
  ${(p) => p.theme.typography.labelSmall}
  font-style: italic;
  text-align: right;
  color: var(--slate);
`
