import React from "react"
import styled from "styled-components"
import ToolbarButton from "src/app/query-home/toolbar/actions/button"
import {shell} from "electron"
import links from "src/app/core/links"

const BG = styled.div`
  margin-top: 16px;
  padding: 24px;
  width: 100%;
  height: 100%;
  h2 {
    margin-bottom: 0.5em;
  }
`

const StyledP = styled.p`
  margin: 18px 0 0 0;
  color: var(--aqua);
  ${(p) => p.theme.typography.labelNormal}
`

const StyledButton = styled(ToolbarButton)`
  margin: 10px 0 0 0;
`

const viewTroubleshootingDocs = async () => {
  shell.openExternal(links.ZUI_DOCS_CONNNECTION_TROUBLESHOOTING)
}

export function isNetworkError(e: unknown) {
  return e === "The service could not be reached."
}

export function NetworkError() {
  return (
    <BG>
      <h2>Error</h2>
      <StyledP>The service could not be reached.</StyledP>
      <StyledButton
        onClick={viewTroubleshootingDocs}
        text="View Troubleshooting Docs"
      />
    </BG>
  )
}
