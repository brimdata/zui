/* @flow */

import type {Dimens, Margins} from "./types"

interface GenChart {
  margins: Margins;
  dimens: Dimens;
}

export function innerHeight(chart: GenChart) {
  return Math.max(
    chart.dimens.height - chart.margins.top - chart.margins.bottom,
    0
  )
}

export function innerWidth(chart: GenChart) {
  return Math.max(
    chart.dimens.width - chart.margins.left - chart.margins.right,
    0
  )
}
