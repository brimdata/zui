import {useSelector} from "react-redux"
import LogDetails from "src/js/state/LogDetails"
import {ListView} from "src/zui-kit"
import {EmptyText} from "../right-pane/common"
import {IconButton} from "src/components/icon-button"
import {DetailPaneHandler} from "./handler"
import {PathView} from "../results-pane/path-view"

export function DetailPane() {
  const value = useSelector(LogDetails.build)
  if (value) {
    return <Detail value={value} />
  } else {
    return <EmptyText>Select a value in the results to view details.</EmptyText>
  }
}

export function Detail({value}) {
  const handler = new DetailPaneHandler(value)

  return (
    <article className="panels vertical">
      <header className="gutter">
        <nav className="repel gutter-block gutter-space-3xs border-b-solid">
          <div className="cluster">
            <IconButton
              enabled={handler.canGoBack()}
              onClick={() => handler.goBack()}
              iconName="left_arrow"
              label="Previous Selected Value"
            />
            <IconButton
              enabled={handler.canGoForward()}
              onClick={() => handler.goForward()}
              iconName="right_arrow"
              label="Next Selected Value"
            />
          </div>
          <IconButton
            iconName="external_link"
            onClick={() => handler.openInNewWindow()}
            label="Open in New Window"
          />
        </nav>
      </header>
      <section className="principle">
        <ListView
          viewConfig={{customViews: [PathView]}}
          values={[value]}
          valueExpandedDefaultState={{value: true}}
          valueExpandedState={{
            value: handler.state.expanded,
            onChange: (next) => handler.state.setItem("expanded", next),
          }}
          valuePageState={{
            value: handler.state.page,
            onChange: (next) => handler.state.setItem("page", next),
          }}
        />
      </section>
    </article>
  )
}
