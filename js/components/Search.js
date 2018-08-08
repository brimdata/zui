import React from "react"
import XLogViewer from "../connectors/XLogViewer"
import NoEventsFound from "./NoEventsFound"
import WelcomeMessage from "./WelcomeMessage"
import AnalysisTable from "./AnalysisTable"
import XSideBar from "../connectors/XSideBar"
import XLogDetail from "../connectors/XLogDetail"
import Header from "./Header"
import NotConnected from "./NotConnected"

export default class Search extends React.Component {
  render() {
    const {
      eventsPresent,
      isFetching,
      initialLoad,
      analysisPresent,
      isConnected
    } = this.props

    const noEventsFound = !isFetching && !eventsPresent
    const noAnalysisFound = !isFetching && !analysisPresent

    return (
      <div className={className(this.props)}>
        <main className="main-content">
          <Header initialLoad={initialLoad} />

          {!initialLoad &&
            eventsPresent && (
              <section className="results-section">
                <XLogViewer />
                <XLogDetail />
              </section>
            )}

          {!initialLoad &&
            analysisPresent && (
              <div className="results-section">
                <AnalysisTable data={this.props.analysis[0]} />
              </div>
            )}

          {!initialLoad &&
            noEventsFound &&
            noAnalysisFound && <NoEventsFound query={this.props.query} />}

          {initialLoad && <WelcomeMessage />}
        </main>

        <XSideBar />

        {!isConnected && <NotConnected />}
      </div>
    )
  }
}

function className(props) {
  if (props.sideBarIsOpen) return "app-wrapper side-bar-is-open"
  else return "app-wrapper"
}
