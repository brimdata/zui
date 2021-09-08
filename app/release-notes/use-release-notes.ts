import {metaClient} from "app/ipc/meta"
import {useEffect, useState} from "react"

async function fetchNotes(version: string) {
  const repo = await metaClient.repo()

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
    if (e instanceof Error) {
      if (e.message === "Failed to fetch") {
        return message + "Error: No internet access"
      } else {
        return message + e.toString()
      }
    } else {
      return message + JSON.stringify(e)
    }
  }
}

export function useReleaseNotes() {
  const [notes, setNotes] = useState("")
  const [version, setVersion] = useState("")
  const [fetching, setIsFetching] = useState(true)

  useEffect(() => {
    metaClient
      .version()
      .then((v) => {
        setVersion(v)
        return fetchNotes(v)
      })
      .then((n) => setNotes(n))
      .catch((e) => setNotes(e.toString()))
      .finally(() => setIsFetching(false))
  }, [])

  return {notes, version, fetching}
}
