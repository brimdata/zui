/* @flow */

export const itestLocator = "data-test-locator"

const dataAttrs = {
  // The purpose of this object is to have a single source of truth where tests
  // and code can identify and find specific elements that integration tests
  // are interested in. This is done by injecting custom data attributes [1]
  // into the DOM.
  // [1] https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*
  contextMenu: "contextMenu",
  correlationPanel: "correlationPanel",
  curlCommand: "curlCommand",
  curlModal: "curlModal",
  debugAst: "debugAst",
  debugModal: "debugModal",
  debugProgram: "debugProgram",
  downloadMessage: "downloadMessage",
  histogram: "histogram-chart",
  ingestProgress: "ingestProgress",
  killHistogramSearch: "killHistogramSearch",
  killViewerSearch: "killViewerSearch",
  login: "login",
  notification: "notification-header",
  optionsButton: "optionsButton",
  optionsMenu: "optionsMenu",
  pcapsButton: "pcapsButton",
  ingestFilesInput: "ingestFilesInput",
  ingestFilesButton: "ingestFilesButton",
  search_input: "search_input",
  search_button: "search_button",
  search_time: "search_time",
  search_speed: "search_speed",
  settingsModal: "settingsModal",
  spacesMenu: "spacesMenu",
  spaces_button: "spaces_button",
  span_button: "span_button",
  span_menu: "span_menu",
  useCacheToggle: "useCacheToggle",
  useIndexToggle: "useIndexToggle",
  viewer_header: "viewer_header",
  viewer_results: "viewer_results"
}

// The purpose of this section is to have a single source of truth for
// interesting selectors. Tests shouldn't hardcode these in multiple places but
// instead use what's defined here. Likewise if product moves stuff around,
// these can be updated in one place.
// The preferred convention is to use CSS selectors, not Xpaths.
const _histogramSelector = `[${itestLocator}='${dataAttrs.histogram}']`

const dataAttrSelector = (component: string) =>
  `[${itestLocator}='` + dataAttrs[component] + "']"

// Use this to generate Xpaths to find elements containing text, all under a
// common dataAttrValue. For example the right-click Log Detail Cell menu that
// produces an option for "Log details" is the element:
//
//   <div class="context-menu" data-test-locator="contextMenu">
//
// genSelectorForTextUnderElement("contextMenu") returns a function that can be used to
// generate Xpaths to specific items contained in that menu, i.e.,
//
//   genSelectorForTextUnderElement("contextMenu")("Open details")
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
  cliHelp: {
    curlCommand: dataAttrSelector("curlCommand"),
    curlModal: dataAttrSelector("curlModal")
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
  ingest: {
    filesInput: dataAttrSelector("ingestFilesInput"),
    filesButton: dataAttrSelector("ingestFilesButton")
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
  settings: {
    button: dataAttrSelector("settingsModal") + " .input-submit > [value=Ok]",
    modal: dataAttrSelector("settingsModal"),
    useCacheToggle: dataAttrSelector("useCacheToggle"),
    useIndexToggle: dataAttrSelector("useIndexToggle")
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
  status: {
    ingestProgress: dataAttrSelector("ingestProgress")
  },
  viewer: {
    contextMenu: dataAttrSelector("contextMenu"),
    contextMenuItem: genSelectorForTextUnderElement("contextMenu"),
    header_base: dataAttrSelector("viewer_header"),
    headers: dataAttrSelector("viewer_header") + " .header-cell",
    results_base: dataAttrSelector("viewer_results"),
    results: dataAttrSelector("viewer_results") + " .field-cell",
    resultCellContaining: genSelectorForTextUnderElement("viewer_results")
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
