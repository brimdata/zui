/* @flow */

import {useDispatch, useSelector} from "react-redux"

import {type DateTuple, spanOfLast} from "../lib/TimeWindow"
import {add} from "../lib/Time"
import {getCurrentSpace} from "../state/reducers/spaces"
import {setOuterTimeWindow} from "../state/actions"
import {submitSearchBar} from "../state/thunks/searchBar"

export default function useSpanPickerMenu() {
  let dispatch = useDispatch()
  let space = useSelector(getCurrentSpace)

  function setSpan(span: DateTuple) {
    dispatch(setOuterTimeWindow(span))
    dispatch(submitSearchBar())
  }

  if (!space) return []
  let {minTime, maxTime} = space
  let spaceSpan = [minTime, add(maxTime, 1, "ms")]

  return [
    {click: () => setSpan(spaceSpan), label: "Whole Space"},
    {click: () => setSpan(spanOfLast(30, "minutes")), label: "Last 30 minutes"},
    {click: () => setSpan(spanOfLast(24, "hours")), label: "Last 24 hours"},
    {click: () => setSpan(spanOfLast(7, "days")), label: "Last 7 days"},
    {click: () => setSpan(spanOfLast(30, "days")), label: "Last 30 days"},
    {click: () => setSpan(spanOfLast(90, "days")), label: "Last 90 days"}
  ]
}

//
// export default class SpanPickerMenu extends React.Component<Props> {
//   setSpan(span: DateTuple) {
//     this.props.dispatch(setOuterTimeWindow(span))
//     this.props.dispatch(submitSearchBar())
//   }
//
//   render() {
//     return (
//       <MenuList {...reactElementProps("span_menu")}>
//         <li onClick={() => this.setSpan(this.props.spaceSpan)}>Whole Space</li>
//         <li onClick={() => this.setSpan(spanOfLast(30, "minutes"))}>
//           Last 30 minutes
//         </li>
//         <li onClick={() => this.setSpan(spanOfLast(24, "hours"))}>
//           Last 24 hours
//         </li>
//         <li onClick={() => this.setSpan(spanOfLast(7, "days"))}>Last 7 days</li>
//         <li onClick={() => this.setSpan(spanOfLast(30, "days"))}>
//           Last 30 days
//         </li>
//         <li onClick={() => this.setSpan(spanOfLast(90, "days"))}>
//           Last 90 days
//         </li>
//       </MenuList>
//     )
//   }
// }
//
// export const XSpanPickerMenu = connect<Props, {||}, _, _, _, _>(
//   (state) => {
//     const [from, to] = getCurrentSpaceTimeWindow(state)
//     return {
//       spaceSpan: [from, add(to, 1, "ms")]
//     }
//   },
//   dispatchToProps
// )(SpanPickerMenu)
