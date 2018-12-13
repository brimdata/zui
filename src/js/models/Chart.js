/* @flow */

type BuilderFunc = ($ReadOnly<Chart>) => Object

type Args = {
  props: Object,
  buildData: BuilderFunc,
  buildMargins: BuilderFunc,
  buildDimens: BuilderFunc,
  buildScales: BuilderFunc
}

export default class Chart {
  props: *
  data: *
  margins: *
  dimens: *
  scales: *

  constructor(args: Args) {
    this.props = args.props
    this.data = args.buildData(this)
    this.margins = args.buildMargins(this)
    this.dimens = args.buildDimens(this)
    this.scales = args.buildScales(this)
  }
}
