import React from "react"

class SearchWelcome extends React.Component {
  componentDidMount() {
    this.props.fetchSpaceStats(this.props.currentSpaceName)
  }

  render() {
    const {space} = this.props
    if (!space) return null

    return (
      <div className="search-welcome">
        <h1>Space: {space.name}</h1>
        <p>Type a search above to explore the bro logs.</p>
        <p>Example searches:</p>
        <pre>method=POST</pre>
        <pre>history=ShA*</pre>
        <pre>192.32.142.32</pre>
        <pre>* | count() by _path</pre>
      </div>
    )
  }
}

export default SearchWelcome
