import {invoke} from "src/core/invoke"

export async function getFilePaths(files: File[]) {
  if (files.length === 0) return []
  // If there is no path field, we are in a playwright e2e test
  // So request the file paths the test prepared
  if (files[0].path === "") {
    return await invoke("e2e.getFilePaths")
  } else {
    return files.map((file) => file.path)
  }
}
