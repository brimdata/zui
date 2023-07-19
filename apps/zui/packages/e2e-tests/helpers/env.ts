import path from "path"

export const repoDir = (): string =>
  path.resolve(path.join(__dirname, "..", "..", ".."))

export const itestDir = (): string =>
  path.join(process.env.WORKSPACE || "run", "playwright-itest")

export const testDataDir = (): string =>
  path.resolve(path.join(repoDir(), "src", "test", "shared", "data"))
