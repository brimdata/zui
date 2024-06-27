import {MutableRefObject, useEffect, useLayoutEffect} from "react"
import {cmdOrCtrl} from "src/util/keyboard"

// This should be called use form conditionals

function createHook(keyword, callback) {
  const attr = "data-" + keyword + "-when"
  const selector = "[" + attr + "]"

  return function useFormConditional(ref: MutableRefObject<HTMLFormElement>) {
    function run() {
      if (!ref.current) return
      const form = ref.current
      const data = new FormData(form)
      const elements = form.querySelectorAll<HTMLElement>(selector)
      for (const element of elements) {
        const code = element.getAttribute(attr)
        const isTrue = condition(code, data)
        callback(element, isTrue)
      }
    }

    useLayoutEffect(() => {
      run()
      ref.current.addEventListener("input", run)
      return () => {
        ref.current.addEventListener("input", run)
      }
    }, [])
  }
}

function condition(code, data) {
  const exprs = code.split("&&")
  const result = exprs.every((expr) => {
    const [left, right] = expr.trim().split("==")
    return data.get(left) === right
  })
  return result
}

export const useRequiredWhen = createHook("required", (element, isTrue) => {
  if (isTrue) {
    element.setAttribute("required", "true")
  } else {
    element.removeAttribute("required")
  }
})

export const useDisabledWhen = createHook("disabled", (element, isTrue) => {
  if (isTrue) {
    element.setAttribute("disabled", "true")
  } else {
    element.removeAttribute("disabled")
  }
})

export const useShowWhen = createHook("show", (element, isTrue) => {
  element.style.display = isTrue ? "" : "none"
})

function keyMatch(event, expr) {
  return expr.split("+").every((token) => {
    switch (token) {
      case "Enter":
        return true
      case "CmdOrCtrl":
        return cmdOrCtrl(event)
      default:
        throw new Error("Unknown key token in data-submit-key")
    }
  })
}

export function useSubmitKey(ref) {
  const attr = "data-submit-key"
  const selector = "[" + attr + "]:not([disabled])"

  useEffect(() => {
    function run(event) {
      if (!ref.current) return
      if (event.key === "Enter") {
        const buttons = Array.from(
          ref.current.querySelectorAll(selector)
        ) as HTMLElement[]

        const button = buttons.find((button) => {
          const expr = button.getAttribute(attr)
          const match = keyMatch(event, expr)
          return match
        })

        if (button) {
          event.preventDefault()
          button.click()
        }
      }
    }
    ref.current?.addEventListener("keydown", run)
    return () => {
      ref.current?.addEventListener("keydown", run)
    }
  }, [])
}
