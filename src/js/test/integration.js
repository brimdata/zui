/* @flow */

import Field from "../models/Field"
import Log from "../models/Log"

// These fixtures are intermediate representation of test data needed to send
// native menu data to Electron. They shouldn't be directly exposed to tests as
// they are internal representations. How to make them better is under
// consideration.
const FIXTURES = {
  logs: {
    conn1:
      "_td:int	_path:string	ts:time	uid:string	id.orig_h:addr	id.orig_p:port	id.resp_h:addr	id.resp_p:port	proto:enum	service:string	duration:interval	orig_bytes:count	resp_bytes:count	conn_state:string	local_orig:bool	local_resp:bool	missed_bytes:count	history:string	orig_pkts:countorig_ip_bytes:count	resp_pkts:count	resp_ip_bytes:count	tunnel_parents:set[string]		0	conn	1425612054.369843	Cynwae4qh1GxM82hQ2	192.168.0.50	1900	239.255.255.250	1900	udp	-	2.000293	282	0	S0	-	-	0	D	3	366	0	0	(empty)",
    unsetDurationConn:
      "_path:string	ts:time	uid:string	id.orig_h:addr	id.orig_p:port	id.resp_h:addr	id.resp_p:port	proto:enum	service:string	duration:interval	orig_bytes:count	resp_bytes:count	conn_state:string	local_orig:bool	local_resp:bool	missed_bytes:count	history:string	orig_pkts:count	orig_ip_bytes:count	resp_pkts:count	resp_ip_bytes:count	tunnel_parents:set[string]		conn	1428917684.727039	CgVEQNkcytYYMtmE5	192.168.0.51	5353	224.0.0.251	5353	udp	dns	-	-	-	S0	T	F	0	D	1	385	0	0	-",
    setDurationConn:
      "_path:string	ts:time	uid:string	id.orig_h:addr	id.orig_p:port	id.resp_h:addr	id.resp_p:port	proto:enum	service:string	duration:interval	orig_bytes:count	resp_bytes:count	conn_state:string	local_orig:bool	local_resp:bool	missed_bytes:count	history:string	orig_pkts:count	orig_ip_bytes:count	resp_pkts:count	resp_ip_bytes:count	tunnel_parents:set[string]		conn	1428917653.242511	CZusuU27VRdyfg5thj	192.168.0.51	138	192.168.0.255	138	udp	-	0.000031	474	0	S0	T	T	0	D	2	530	0	0	-",
    dhcp1:
      "_td:int	_path:string	ts:time	uid:string	id.orig_h:addr	id.orig_p:port	id.resp_h:addr	id.resp_p:port	mac:string	assigned_ip:addr	lease_time:interval	trans_id:count		1	dhcp	1425567029.996704	CrTPSI1Qb5sB8eBmm7	192.168.0.51	68	192.168.0.1	67	ec:f4:bb:4f:b2:45	192.168.0.51	86400.000000	4244918360",
    weird1:
      "_td:int	_path:string	ts:time	uid:string	id.orig_h:addr	id.orig_p:port	id.resp_h:addr	id.resp_p:port	name:string	addl:string	notice:bool	peer:string		12	weird	1425565544.849413	Cum4LVba3W3KNG6qa	fe80::eef4:bbff:fe51:89ec	5353	ff02::fb	5353	dns_unmatched_msg	-	F	bro",
    myBusinessDocHttp:
      "_path:string	ts:time	uid:string	id.orig_h:addr	id.orig_p:port	id.resp_h:addr	id.resp_p:port	trans_depth:count	method:string	host:string	uri:string	referrer:string	version:string	user_agent:string	request_body_len:count	response_body_len:count	status_code:count	status_msg:string	info_code:count	info_msg:string	tags:set[enum]	username:string	password:string	proxied:set[string]	orig_fuids:vector[string]	orig_filenames:vector[string]	orig_mime_types:vector[string] resp_fuids:vector[string]	resp_filenames:vector[string]	resp_mime_types:vector[string]		http	1428413684.244295	C9FG8S2NvxVUR0b0La	192.168.0.53	2210	68.164.182.11	80	1	GET	www.mybusinessdoc.com	/document.php?rnd=3271&id=5555525E01160D0F4A0C0E010809120D0F240309050D084A070B09	-	1.1	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0)	0	318883	200	OK	-	-	(empty)-	-	-	-	-	-	FGx5ts2iCMfZSUgO8c	c87ed3c.gif	application/x-dosexec"
  },
  fields: {
    uid1: "uid:string\tCgVEQNkcytYYMtmE5",
    uid2: "uid:string\tCtd0Gv1XC3Z0UV1iX",
    uid3: "uid:string\tC9FG8S2NvxVUR0b0La",
    uid4: "uid:string\tCZusuU27VRdyfg5thj",
    conn: "_path:string\tconn",
    dhcp: "_path:string\tdhcp",
    weird: "_path:string\tweird",
    ts1: "ts:time\t1428917565.138847",
    ts2: "ts:time\t1428917684.727039"
  }
}

const logFixture = (name: string): Log => {
  let string = FIXTURES.logs[name]
  if (string) {
    return Log.fromString(string)
  } else {
    throw new Error("Unknown log fixture: " + name)
  }
}

const fieldFixture = (name: string): Field => {
  let string = FIXTURES.fields[name]
  if (string) {
    return Field.fromString(string)
  } else {
    throw new Error("Unknown field fixture: " + name)
  }
}

export const itestLocator = "data-test-locator"

const dataAttrs = {
  // The purpose of this object is to have a single source of truth where tests
  // and code can identify and find specific elements that integration tests
  // are interested in. This is done by injecting custom data attributes [1]
  // into the DOM.
  // [1] https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*
  correlationPanel: "correlationPanel",
  curlCommand: "curlCommand",
  curlModal: "curlModal",
  debugAst: "debugAst",
  debugModal: "debugModal",
  debugProgram: "debugProgram",
  downloadMessage: "downloadMessage",
  histogram: "histogram-chart",
  killHistogramSearch: "killHistogramSearch",
  killViewerSearch: "killViewerSearch",
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

export const dataSets = {
  // The purpose of this object is to have a single source of truth about
  // bounds and metrics related to test data. These numbers are also dependent
  // on product behavior. For example, if the default time window changes from
  // last 30 minutes to last hour, some of these numbers may become invalid.
  // XXX This object probably doesn't belong here, as it has nothing to do with
  // Brim. Move this to itest/lib.
  all: {
    rightClickSearch: {
      connPathValue: fieldFixture("conn"),
      dhcpPathValue: fieldFixture("dhcp"),
      weirdPathValue: fieldFixture("weird")
    }
  },
  corelight: {
    logDetails: {
      getDetailsFrom: fieldFixture("uid3"),
      initialSearch: "_path=http www.mybusinessdoc.com | sort",
      myBusinessDocHttpLog: logFixture("myBusinessDocHttp"),
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
      connLog: logFixture("conn1"),
      dhcpLog: logFixture("dhcp1"),
      endTime: fieldFixture("ts2"),
      newSearchSetup: fieldFixture("uid2"),
      includeValue: fieldFixture("uid1"),
      startTime: fieldFixture("ts1"),
      weirdLog: logFixture("weird1")
    },
    pcaps: {
      logDetailsFilename: "packets-1428413683.772332.pcap",
      logDetailsMD5: "40a896bf40bd2d7155ce5b52bb4924cc",
      setDurationConnLog: logFixture("setDurationConn"),
      setDurationFilename: "packets-1428917653.242511.pcap",
      setDurationMD5: "a6cba8acc833dff9f2a04acd7ac0304a",
      setDurationUid: fieldFixture("uid4"),
      unsetDurationConnLog: logFixture("unsetDurationConn"),
      unsetDurationUid: fieldFixture("uid1")
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
  pcaps: {
    button: dataAttrSelector("pcapsButton")
  },
  search: {
    button: dataAttrSelector("search_button"),
    input: dataAttrSelector("search_input"),
    speed: dataAttrSelector("search_speed"),
    time: dataAttrSelector("search_time")
  },
  searchInspector: {
    killHistogramSearch: dataAttrSelector("killHistogramSearch"),
    killViewerSearch: dataAttrSelector("killViewerSearch")
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
  viewer: {
    header_base: dataAttrSelector("viewer_header"),
    headers: dataAttrSelector("viewer_header") + " .header-cell",
    results_base: dataAttrSelector("viewer_results"),
    results: dataAttrSelector("viewer_results") + " .field-cell",
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
