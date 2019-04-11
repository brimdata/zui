/* @flow */

import React, {useLayoutEffect, useRef} from "react"
import classNames from "classnames"

import {Fieldset} from "./Typography"
import Chart from "../charts/Chart"
import LoadingMessage from "./LoadingMessage"

type Props = {
  chart: Chart,
  isFetching: boolean,
  isEmpty: boolean
}

export default function SVGChart(props: Props) {
  const {chart, isFetching, isEmpty, ...rest} = props
  const {width, height} = chart.dimens
  const svg = useRef(null)

  useLayoutEffect(() => {
    chart.mount(svg.current)
  }, [])

  useLayoutEffect(() => {
    chart.draw()
  })

  return (
    <div style={{width, height}} {...rest}>
      <div id="histogram-tooltip" />
      <LoadingMessage show={isFetching} message="Loading Chart" />
      <Fieldset
        className={classNames("no-chart-data", {
          visible: !isFetching && isEmpty
        })}
      >
        No Chart Data
      </Fieldset>
      <svg ref={svg} height={height} width={width} />
    </div>
  )
}
