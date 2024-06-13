import React from "react"
import Back from "../../js/components/icons/back-arrow"
import Forward from "../../js/components/icons/forward-arrow"

type Props = {
  prevExists: boolean
  nextExists: boolean
  backFunc: (ClickEvent) => void
  forwardFunc: (ClickEvent) => void
}

export class HistoryButtons extends React.Component<Props> {
  render() {
    const {prevExists, nextExists, backFunc, forwardFunc} = this.props

    return (
      <div className="history-buttons">
        <button
          className="panel-button back-button"
          disabled={!prevExists}
          onClick={backFunc}
        >
          <Back />
        </button>
        <button
          className="panel-button forward-button"
          onClick={forwardFunc}
          disabled={!nextExists}
        >
          <Forward />
        </button>
      </div>
    )
  }
}
