import {MutableRefObject, useLayoutEffect} from "react"

export function useMemoryForm(
  ref: MutableRefObject<HTMLFormElement>,
  formName: string
) {
  function getKey(e) {
    return formName + ":" + e.name + ":" + e.type
  }

  function getVal(key) {
    return localStorage.getItem(key)
  }

  function setVal(key, val) {
    localStorage.setItem(key, val)
  }

  function optOut(element) {
    return element.dataset.memory === "false"
  }

  function onInput(e) {
    if (optOut(e.target)) return
    const key = getKey(e.target)
    const val = e.target.value
    setVal(key, val)
  }

  function setInput(el: HTMLFormElement, val: string) {
    switch (el.type) {
      case "radio":
        if (el.value == val) el.checked = true
        break
      case "select-one":
        if (selectHasOption(el, val)) el.value = val
        break
      default:
        el.value = val
        break
    }
  }

  function init() {
    for (const e of ref.current.elements) {
      if (optOut(e)) continue
      const key = getKey(e)
      const val = getVal(key)
      if (val) setInput(e as HTMLFormElement, val)
    }
  }

  useLayoutEffect(() => {
    if (!ref.current) return
    init()
    ref.current.addEventListener("input", onInput)
    return () => {
      ref.current.removeEventListener("input", onInput)
    }
  }, [])
}

function selectHasOption(select, value) {
  return Array.from(select.options)
    .map((opt: HTMLOptionElement) => opt.value)
    .includes(value)
}
