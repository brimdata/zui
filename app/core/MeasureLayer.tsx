import ReactDOM from "react-dom"
import doc from "src/js/lib/doc"

export default function MeasureLayer({children}: {children: JSX.Element}) {
  return ReactDOM.createPortal(children, doc.id("measure-layer"))
}
