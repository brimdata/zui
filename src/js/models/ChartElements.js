/* @flow */

import Chart from "./Chart"

export interface ChartElement {
  mount(chart: Chart, svg: HTMLElement): void;
  draw(chart: Chart, svg: HTMLElement): void;
}

export default class ChartElements {
  svg: HTMLElement
  chart: Chart
  elements: ChartElement[]

  constructor(elements: ChartElement[]) {
    this.elements = elements
  }

  updateChart(chart: Chart) {
    this.chart = chart
  }

  mount(svg: HTMLElement) {
    this.svg = svg
    this.each(el => el.mount(this.chart, this.svg))
  }

  draw() {
    this.each(el => el.draw(this.chart, this.svg))
  }

  each(func: Function) {
    this.elements.forEach(func)
  }
}
