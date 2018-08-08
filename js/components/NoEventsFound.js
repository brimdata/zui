import React from "react"

export default class NoEventsFound extends React.Component {
  render() {
    return (
      <div className="no-events-found-wrapper">
        <div className="no-events-found">
          <h3>No events found</h3>
          <table>
            <tbody>
              <tr>
                <td>Filters:</td>
                <td>
                  <pre className="light">
                    {this.props.query.getFilterString()}
                  </pre>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
