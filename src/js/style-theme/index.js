/* @flow */

import {css} from "styled-components"

const headingSection = css`
  font-family: system-ui, sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 1px;
`

const headingList = css`
  font-family: system-ui, sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
`

const labelSmall = css`
  font-family: system-ui, sans-serif;
  font-size: 11px;
  line-height: 17px;
  font-weight: 400;
`

const labelNormal = css`
  font-family: system-ui, sans-serif;
  font-size: 13px;
  line-height: 16px;
  font-weight: 500;
`

const labelBold = css`
  font-family: system-ui, sans-serif;
  letter-spacing: -0.08;
  font-size: 13px;
  line-height: 16px;
  font-weight: 600;
`

const theme = {
  colors: {
    white: "#FFFFFF",
    snow: "#FDFCFB",
    coconut: "#F8F7F6",
    ivory: "#F2F1F0",
    cloudy: "#DEDDDC",
    lead: "#AEADAC",
    slate: "#757371",
    aqua: "#262524",
    pecan: "#9C692F",
    havelock: "#4B91E2",
    azure: "#2F629C",
    cello: "#324862"
  },
  typography: {
    headingSection,
    headingList,
    labelSmall,
    labelNormal,
    labelBold
  }
}

export default theme
