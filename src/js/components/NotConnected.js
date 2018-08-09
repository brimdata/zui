import React from "react"
import {Link} from "react-router-dom"

const NotConnected = () => (
  <div className="not-connected">
    <p>
      Having trouble connecting to boomd.{" "}
      <Link to="/connect">Try signing in again</Link>
    </p>
  </div>
)

export default NotConnected
