/* @flow */

export const itestLocator = "data-test-locator"

const dataAttrs = {
  // The purpose of this object is to have a single source of truth where tests
  // and code can identify and find specific elements that integration tests
  // are interested in. This is done by injecting custom data attributes [1]
  // into the DOM.
  // [1] https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*
  correlationPanel: "correlationPanel",
  debugAst: "debugAst",
  debugModal: "debugModal",
  debugProgram: "debugProgram",
  downloadMessage: "downloadMessage",
  histogram: "histogram-chart",
  logCellMenu: "logCellMenu",
  login: "login",
  notification: "notification-header",
  optionsButton: "optionsButton",
  optionsMenu: "optionsMenu",
  pcapsButton: "pcapsButton",
  search_input: "search_input",
  search_button: "search_button",
  search_time: "search_time",
  search_speed: "search_speed",
  spacesMenu: "spacesMenu",
  spaces_button: "spaces_button",
  span_button: "span_button",
  span_menu: "span_menu",
  viewer_header: "viewer_header",
  viewer_results: "viewer_results"
}

export const dataSets = {
  // The purpose of this object is to have a single source of truth about
  // bounds and metrics related to test data. These numbers are also dependent
  // on product behavior. For example, if the default time window changes from
  // last 30 minutes to last hour, some of these numbers may become invalid.
  // XXX This object probably doesn't belong here, as it has nothing to do with
  // Brim. Move this to itest/lib.
  corelight: {
    logDetails: {
      getDetailsFrom: "C9FG8S2NvxVUR0b0La",
      initialSearch: "_path=http www.mybusinessdoc.com | sort",
      span: "Whole Space"
    },
    histogram: {
      defaultDistinctPaths: 12,
      defaultRectsPerClass: 49,
      defaultTotalRectCount: 588,
      rectAttrMin: 0,
      rectAttrMax: 1000,
      wholeSpaceDistinctPaths: 19
    },
    rightClickSearch: {
      endTime: "09:34",
      newSearchSetup: "Ctd0Gv1XC3Z0UV1iX",
      includeValue: "CgVEQNkcytYYMtmE5",
      startTime: "09:32"
    },
    pcaps: {
      setDurationUid: "CZusuU27VRdyfg5thj",
      setDurationFilename: "packets-1428917653.242511.pcap",
      setDurationMD5: "a6cba8acc833dff9f2a04acd7ac0304a",
      unsetDurationUid: "CgVEQNkcytYYMtmE5"
    }
  }
}

// The purpose of this section is to have a single source of truth for
// interesting selectors. Tests shouldn't hardcode these in multiple places but
// instead use what's defined here. Likewise if product moves stuff around,
// these can be updated in one place.
// The preferred convention is to use CSS selectors, not Xpaths.
const _histogramSelector = `[${itestLocator}='${dataAttrs.histogram}']`

const dataAttrSelector = (component: string) =>
  `[${itestLocator}='` + dataAttrs[component] + "']"

// Use this to generate Xpaths to find elemnents containing text, all under a
// common dataAttrValue. For example the right-click Log Detail Cell menu that
// produces an option for "Log details" is the element:
//
//   <ul class="menu-list" data-test-locator="logCellMenu">
//
// genSelectorForTextUnderElement("logCellMenu") returns a function that can be used to
// generate Xpaths to specific items contained in that menu, i.e.,
//
//   genSelectorForTextUnderElement("logCellMenu")("Open details")
//
// Xpaths are used because CSS selectors don't have the capability to evaluate
// whether a child text node has particular content.
// https://stackoverflow.com/questions/1520429/is-there-a-css-selector-for-elements-containing-certain-text
const genSelectorForTextUnderElement = (dataAttrValue: string) => (
  menuItem: string
) =>
  `//*[@${itestLocator}='${dataAttrValue}']//*[contains(text(), '${menuItem}')]`

// Use this to generate a function that can generate selectors to find elements
// for modal buttons under the given modal data-test-locator name.
const genSelectorForModalButton = (modalTestName: string) => (
  buttonValue: string
) => `[${itestLocator}='${modalTestName}'] input[value='${buttonValue}']`

export const selectors = {
  downloadMessage: dataAttrSelector("downloadMessage"),
  correlationPanel: {
    duration: dataAttrSelector("correlationPanel") + " .caption",
    pathTag: dataAttrSelector("correlationPanel") + " .path-tag",
    tsLabel: dataAttrSelector("correlationPanel") + " .data-label",
    getText: genSelectorForTextUnderElement("correlationPanel")
  },
  debugSearch: {
    ast: dataAttrSelector("debugAst") + " span",
    astError: dataAttrSelector("debugAst"),
    search: dataAttrSelector("debugProgram"),
    done: genSelectorForModalButton("debugModal")("Done")
  },
  histogram: {
    topLevel: dataAttrSelector("histogram"),
    gElem: dataAttrSelector("histogram") + " g",
    rectElem: dataAttrSelector("histogram") + " rect"
  },
  login: {
    host: dataAttrSelector("login") + " [name=host]",
    button: dataAttrSelector("login") + " [type=submit]"
  },
  notification: dataAttrSelector("notification"),
  options: {
    button: dataAttrSelector("optionsButton"),
    menu: dataAttrSelector("optionsMenu"),
    menuItem: genSelectorForTextUnderElement("optionsMenu")
  },
  pcaps: {
    button: dataAttrSelector("pcapsButton")
  },
  search: {
    button: dataAttrSelector("search_button"),
    input: dataAttrSelector("search_input"),
    speed: dataAttrSelector("search_speed"),
    time: dataAttrSelector("search_time")
  },
  spaces: {
    button: dataAttrSelector("spaces_button"),
    menu: dataAttrSelector("spacesMenu"),
    menuItem: genSelectorForTextUnderElement("spacesMenu")
  },
  span: {
    button: dataAttrSelector("span_button"),
    menu: dataAttrSelector("span_menu"),
    menuItem: genSelectorForTextUnderElement("span_menu")
  },
  viewer: {
    header_base: dataAttrSelector("viewer_header"),
    headers: dataAttrSelector("viewer_header") + " .header-cell",
    results_base: dataAttrSelector("viewer_results"),
    results: dataAttrSelector("viewer_results") + " span",
    resultCellContaining: genSelectorForTextUnderElement("viewer_results"),
    rightClickMenu: dataAttrSelector("logCellMenu"),
    rightClickMenuItem: genSelectorForTextUnderElement("logCellMenu")
  }
}

// Use this function to add properties to react elements/components. The
// dataAttrs object must define the key/value pair for the object. The key is
// the argument passed into this method upon use. The value is what will be in
// the product's DOM.
// Integration tests that want to find the element/component via selector can
// define, import, and use the selectors object above.
export const reactElementProps = (component: string) => {
  return {
    [itestLocator]: dataAttrs[component]
  }
}

// This function is like reactElementProps except used to annotate D3 elements.
export const d3ElementAttr = (component: string) => dataAttrs[component]
