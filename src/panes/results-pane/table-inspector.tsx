import React from "react"
import {fuse} from "src/app/commands/editor"
import {config} from "src/components/zed-table/config"
import styled from "styled-components"
import {useResultsPaneContext} from "./context"
import {Inspector} from "./inspector"
/**
 * This component is for when the user wants a table,
 * but their data has more than one shape
 */

const Warning = styled.p`
  border-bottom: 1px solid var(--border-color);
  height: 100%;
  line-height: ${config.headerHeight}px;
  padding: 0 16px;

  a {
    color: var(--primary-color);
    text-decoration: underline;
    cursor: pointer;
  }
`

export function TableInspector() {
  const {height, shapes} = useResultsPaneContext()
  return (
    <>
      <div style={{height: config.headerHeight}}>
        <Warning>
          <b>{shapes.length} Shapes</b> — Filter to one shape or{" "}
          <b>
            <a onClick={() => fuse.run()}>fuse</a>
          </b>{" "}
          results to view as a table.
        </Warning>
      </div>
      <Inspector height={height - config.headerHeight} />
    </>
  )
}
