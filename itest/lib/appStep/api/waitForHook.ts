import {HookName} from "src/js/state/SystemTest"
import {hookLogLocator} from "src/js/test/locators"

export default async function waitForHook(app, name: HookName) {
  await app.client.waitUntil(async () => {
    const hooks = await app.client.$$(hookLogLocator.css)
    const lastHook = hooks[hooks.length - 1]
    if (lastHook) {
      return (await lastHook.getText()) === name
    } else {
      return false
    }
  })
}
