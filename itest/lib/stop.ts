import fetch from "node-fetch"

export async function quitBrim(app) {
  if (app && app.isRunning()) {
    await app.stop()
    console.log("app stopped, waiting for zqd....")
    while (await isUp()) {
      await new Promise((go) => setTimeout(go, 500))
    }
    console.log("zqd is down")
  }
}

async function isUp() {
  try {
    const response = await fetch("http://localhost:9867/status")
    const text = await response.text()
    return text === "ok"
  } catch (e) {
    return false
  }
}
