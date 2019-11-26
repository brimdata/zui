/* @flow */

export default function() {
  appendDivId("app-root")
  appendDivId("notification-root")
  appendDivId("modal-root")
  appendDivId("tooltip-root")
  appendDivId("context-menu-root")
  appendDivId("measure-layer")
}

function appendDivId(id) {
  let div = document.createElement("div")
  div.id = id
  if (document.body) document.body.appendChild(div)
}
