/* @flow */

export default function(windowDivId: string) {
  appendDivId(windowDivId)
  appendDivId("notification-root")
  appendDivId("modal-root")
  appendDivId("tooltip-root")
  appendDivId("context-menu-root")
  appendDivId("measure-layer")
}

function appendDivId(id: string) {
  let div = document.createElement("div")
  div.id = id
  if (document.body) document.body.appendChild(div)
}
