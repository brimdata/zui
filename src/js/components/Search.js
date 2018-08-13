import React from "react"
import XLogViewer from "../connectors/XLogViewer"
import NoEventsFound from "./NoEventsFound"
import WelcomeMessage from "./WelcomeMessage"
import AnalysisTable from "./AnalysisTable"
import XSideBar from "../connectors/XSideBar"
import XLogDetail from "../connectors/XLogDetail"
import XTitleBar from "../connectors/XTitleBar"
import Header from "./Header"
import NotConnected from "./NotConnected"
import {Redirect} from "react-router-dom"

export default class Search extends React.Component {
  componentDidMount() {
    this.props.fetchAllSpaces()
  }

  render() {
    const {isConnected, currentSpaceName} = this.props
    if (!isConnected) return <Redirect to="/connect" />
    if (!currentSpaceName) return <Redirect to="/spaces" />

    return (
      <div>
        <XTitleBar />
      </div>
    )
  }
}
