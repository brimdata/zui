// /* @flow */
//
// import * as React from "react"
// import XAxis from "./Histogram/XAxis"
//
// type Props = {
//   height: number,
//   width: number
// }
//
// type State = {}
//
// export type Chart = {
//   svg: HTMLElement,
//   marginLeft: number,
//   marginRight: number,
//   marginTop: number,
//   marginBottom: number,
//   height: number,
//   width: number
// }
//
// export default class Histogram extends React.Component<Props, State> {
//   svg: *
//   xAxis: XAxis
//
//   constructor(props: Props) {
//     super(props)
//     this.xAxis = new XAxis()
//   }
//
//   getChartSnapshot() {
//     return {
//       svg: this.svg,
//       marginLeft: 0,
//       marginRight: 0,
//       marginTop: 12,
//       marginBottom: 24,
//       height: this.props.height,
//       width: this.props.width,
//       scales: this.setScales(this.props.timeWindow)
//     }
//   }
//
//   componentDidMount() {
//     const snapshot = this.getChartSnapshot()
//     this.xAxis.onMount(snapshot)
//   }
//
//   render() {
//     return (
//       <div className="histogram">
//         <svg ref={r => (this.svg = r)} />
//       </div>
//     )
//   }
// }
//
// import {connect} from "react-redux"
//
// export const XHistogram = connect()(Histogram)
