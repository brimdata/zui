import {Renderer} from "src/core/renderer"
import {AsyncTasks} from "src/modules/async-tasks"

export function initAsyncTasks(renderer: Renderer) {
  const tasks = new AsyncTasks()
  renderer.on("close", () => tasks.abortAll())
  renderer.on("tab-close", (tabId) => tasks.abort([tabId]))
  return tasks
}
