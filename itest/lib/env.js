/* @flow */

import path from "path"

export const isCI = (): boolean => process.env.GITHUB_ACTIONS === "true"

export const repoDir = (): string =>
  path.resolve(path.join(__dirname, "..", ".."))
