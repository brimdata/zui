/* @flow */

import {css} from "styled-components"

const headingSection = css`
  font-family: system-ui, sans-serif;
  font-weight: 500;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
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
    headingSection
  }
}

export default theme
