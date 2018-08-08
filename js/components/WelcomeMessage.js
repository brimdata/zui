import React from "react"

export default class WelcomeMessage extends React.Component {
  render() {
    return (
      <div className="welcome-message">
        <img src="images/looky-face.png" width="42" height="42" />
        <h3>Looky</h3>
        <p>Search & Analytics for Bro Logs</p>
      </div>
    )
  }
}
