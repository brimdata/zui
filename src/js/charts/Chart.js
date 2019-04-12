/* @flow */

export type ChartElement = {|
  mount?: (chart: Chart) => void,
  draw?: (chart: Chart) => void
|}

type BuilderKey = "data" | "margins" | "dimens" | "scales"
type BuilderFunc = ($ReadOnly<Chart>) => Object
type Builders = {[BuilderKey]: BuilderFunc}

type Args = {
  props: Object,
  builders: Builders,
  elements: ChartElement[]
}

export default class Chart {
  props: *
  data: *
  margins: *
  dimens: *
  scales: *
  builders: Builders
  elements: ChartElement[]
  svg: HTMLElement

  constructor({props, builders, elements}: Args) {
    this.elements = elements
    this.builders = builders
    this.update(props)
  }

  update(props: Object) {
    this.props = {...this.props, ...props}
    this.data = this.builders.data(this)
    this.margins = this.builders.margins(this)
    this.dimens = this.builders.dimens(this)
    this.scales = this.builders.scales(this)
  }

  mount(svg: *) {
    this.svg = svg
    this.elements.forEach((el) => el.mount && el.mount(this))
  }

  draw() {
    this.elements.forEach((el) => el.draw && el.draw(this))
  }
}
