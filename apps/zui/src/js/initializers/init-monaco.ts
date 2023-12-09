import {tokens} from "src/core/zed-syntax"
import {loader} from "@monaco-editor/react"

export async function initializeMonaco() {
  if (globalThis.env.isTest) return // Only works in a browser environment
  try {
    const monaco = await loader.init()
    monaco.languages.register({id: "zed"})
    monaco.languages.setMonarchTokensProvider("zed", tokens)
    document.fonts.addEventListener("loadingdone", () => {
      monaco.editor.remeasureFonts()
    })
  } catch (e) {
    console.error("No window environment", e)
  }
}
