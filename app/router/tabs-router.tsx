import Histories from "app/core/models/histories"
import {Location} from "history"
import React from "react"
import {
  // @ts-ignore
  __HistoryContext as HistoryContext,
  __RouterContext as RouterContext
} from "react-router"

type Props = {
  tabId: string
  histories: Histories
  staticContext?: any
}

type State = {
  location: Location
}

/**
 * Mostly copied from https://github.com/ReactTraining/react-router/blob/be6a22f8c5a0d19011e42ed444ba77e0d4432f87/packages/react-router/modules/Router.js
 */
export default class TabsRouter extends React.Component<Props, State> {
  private _isMounted: boolean
  private _pendingLocation: Location | null
  private unlisten: () => void

  static computeRootMatch(pathname) {
    return {path: "/", url: "/", params: {}, isExact: pathname === "/"}
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      location: this.getHistory().location
    }

    // This is a bit of a hack. We have to start listening for location
    // changes here in the constructor in case there are any <Redirect>s
    // on the initial render. If there are, they will replace/push when
    // they mount and since cDM fires in children before parents, we may
    // get a new location before the <Router> is mounted.
    this._isMounted = false
    this._pendingLocation = null

    if (!props.staticContext) {
      this.unlisten = this.props.histories.listen((location) => {
        if (this._isMounted) {
          this.setState({location})
        } else {
          this._pendingLocation = location
        }
      })
    }
  }

  componentDidMount() {
    this._isMounted = true

    if (this._pendingLocation) {
      this.setState({location: this._pendingLocation})
    }
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten()
      this._isMounted = false
      this._pendingLocation = null
    }
  }

  getHistory() {
    return this.props.histories.getOrCreate(this.props.tabId)
  }

  render() {
    const history = this.getHistory()
    let location
    if (this.state.location.key !== history.location.key) {
      // This only happens when switching tabs. The listener above does not get called, but the app
      // gets re-rendered. In this case, the state.location is stale. Use the history location.
      console.log("Keys don't match")
      location = history.location
    } else {
      location = this.state.location
    }
    console.log("CONTEXT:", location.pathname)
    return (
      <RouterContext.Provider
        value={{
          history,
          location,
          match: TabsRouter.computeRootMatch(location.pathname),
          staticContext: this.props.staticContext
        }}
      >
        <HistoryContext.Provider value={this.getHistory()}>
          {this.props.children || null}
        </HistoryContext.Provider>
      </RouterContext.Provider>
    )
  }
}
