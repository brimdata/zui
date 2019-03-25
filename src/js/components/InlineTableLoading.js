/* @flow */

import React from "react"

type Props = {
  rows: number,
  title?: string
}

const InlineTableLoading = ({rows, title = "Loading.."}: Props) => {
  return (
    <div className="inline-table inline-table-loading">
      <table>
        <thead>
          <tr>
            <th>{title}</th>
          </tr>
        </thead>
        <tbody>
          {Array(rows)
            .fill()
            .map((_, index) => (
              <tr key={index}>
                <td />
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default InlineTableLoading
