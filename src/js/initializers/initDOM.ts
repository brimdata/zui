export default function() {
  appendDivId("app-root")
  appendDivId("notification-root")
  appendDivId("modal-root")
  appendDivId("tooltip-root")
  appendDivId("context-menu-root")
  appendDivId("measure-layer", {hidden: true})
  detectInputType()
}

type Args = {
  hidden: boolean
}

function appendDivId(id: string, args: Partial<Args> = {}) {
  const div = document.createElement("div")
  div.id = id
  if (args.hidden) div.style.visibility = "hidden"
  if (document.body) document.body.appendChild(div)
}

function detectInputType() {
  document.addEventListener("mousedown", () => {
    const el = document.body
    if (!el) return
    el.classList.add("using-mouse")
    el.classList.remove("using-keyboard")
  })
  document.addEventListener("keydown", (e) => {
    const el = document.body
    if (!el) return
    if (e.key === "Tab") {
      el.classList.add("using-keyboard")
      el.classList.remove("using-mouse")
    }
  })
}
