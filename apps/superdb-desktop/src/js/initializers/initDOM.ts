export default function initDOM() {
  appendDivId("notification-root")
  appendDivId("modal-root")
  appendDivId("tooltip-root")
  appendDivId("context-menu-root")
  if (globalThis.env.isMac) {
    document.body.classList.add("is-mac")
  }
}

type Args = {
  hidden: boolean
}

function appendDivId(id: string, args: Partial<Args> = {}) {
  if ("document" in globalThis) {
    const div = document.createElement("div")
    div.id = id
    if (args.hidden) div.style.visibility = "hidden"
    if (document.body) document.body.appendChild(div)
  }
}
