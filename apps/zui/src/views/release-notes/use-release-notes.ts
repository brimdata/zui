import {useEffect, useState} from "react"
import fetch from "cross-fetch"

async function fetchNotes(version) {
  const repo = global.appMeta.repo
  const url = `https://api.github.com/repos/${repo}/releases/tags/v${version}`

  try {
    const resp = await fetch(url)
    if (resp.ok) {
      const json = await resp.json()
      return json.body
    } else {
      throw new Error("Not found " + url)
    }
  } catch (e) {
    let message =
      "There was a problem fetching the release notes for this version. \n\n"
    if (e.message === "Failed to fetch") {
      return message + "Error: No internet access"
    } else {
      return message + e.toString()
    }
  }
}

export function useReleaseNotes() {
  const [notes, setNotes] = useState("")
  const version = global.appMeta.version
  const [fetching, setIsFetching] = useState(true)

  useEffect(() => {
    fetchNotes(version)
      .then((n) => setNotes(n))
      .catch((e) => setNotes(e.toString()))
      .finally(() => setIsFetching(false))
  }, [])

  return {notes, version, fetching}
}
