import {cssVar, transparentize} from "polished"
import React from "react"
import styled from "styled-components"
import GridLayout from "react-grid-layout"
import {ParentSize} from "@vx/responsive"

const BG = styled.div`
  height: 100%;
  .react-grid-placeholder {
    opacity: 1;
    background: ${transparentize(0.99, cssVar("--havelock") as string)};
    border-radius: 4px;
    box-shadow: 0 0 3px var(--havelock);
  }
  .react-draggable-dragging {
    box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.2);
    z-index: 999;
  }
`
export default function Grid({children, layout, onLayoutChange}) {
  return (
    <BG>
      <ParentSize>
        {({width}) => (
          <GridLayout
            layout={layout}
            onLayoutChange={onLayoutChange}
            className="layout"
            cols={4}
            rowHeight={24}
            width={width}
            margin={[12, 12]}
          >
            {children}
          </GridLayout>
        )}
      </ParentSize>
    </BG>
  )
}
