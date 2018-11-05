import React from "react"

class SearchWelcome extends React.Component {
  componentDidMount() {}

  render() {
    const {space} = this.props
    if (!space) return null

    return (
      <div className="search-welcome body-content">
        <h1>Space: {space.name}</h1>
        <p>Type a search above to explore the Zeek logs.</p>
        <p>Example searches:</p>
        <ul>
          <li>
            <code>method=POST</code>
          </li>
          <li>
            <code>history=ShA*</code>
          </li>
          <li>
            <code>192.32.142.32</code>
          </li>
          <li>
            <code>* | count() by _path</code>
          </li>
        </ul>
      </div>
    )
  }
}

export default SearchWelcome
