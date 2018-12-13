/* @flow */

export default class Chart {
  props: *
  data: *
  margins: *
  dimens: *
  scales: *

  constructor({props, buildData, buildMargins, buildDimens, buildScales}) {
    this.props = props
    this.data = buildData(this)
    this.margins = buildMargins(this)
    this.dimens = buildDimens(this)
    this.scales = buildScales(this)
  }
}
