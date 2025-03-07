/* @noflow */

const child_process = require("child_process")
const fs = require("fs-extra")
const got = require("got")
const path = require("path")
const tmp = require("tmp")
const packageJSON = require("../package.json")
const decompress = require("decompress")
const depsDir = path.resolve("zdeps")

const platformDefs = {
  darwin: {
    superBin: "super",
    osarch: "darwin-amd64",
    ext: "tar.gz",
  },
  linux: {
    superBin: "super",
    osarch: "linux-amd64",
    ext: "tar.gz",
  },
  win32: {
    superBin: "super.exe",
    osarch: "windows-amd64",
    ext: "zip",
  },
}

async function download(url, targetfile) {
  await fs.mkdirp(path.dirname(targetfile))
  const writeStream = fs.createWriteStream(targetfile)
  return new Promise((resolve, reject) => {
    const gotStream = got.stream(url)
    gotStream.pipe(writeStream)
    gotStream.on("error", (err) => {
      if (writeStream.destroy) {
        writeStream.destroy(err)
      }
      reject(err)
    })
    writeStream.on("error", (err) => reject(err))
    writeStream.on("close", () => resolve())
  })
}

async function unzipTo(zipfile, dir) {
  await fs.mkdirp(dir)
  await decompress(zipfile, dir)
}

function artifactPaths(version) {
  const plat = platformDefs[process.platform]

  const artifactFile = `super-${version}.${plat.osarch}.${plat.ext}`
  const artifactUrl = `https://github.com/brimdata/super/releases/download/${version}/${artifactFile}`

  return {
    artifactFile,
    artifactUrl,
  }
}

// Download and extract the zed binary for this platform to the specified
// directory. Returns the absolute path of the zed binary file.
async function artifactsDownload(version, destPath) {
  const plat = platformDefs[process.platform]
  const paths = artifactPaths(version)

  const tmpdir = tmp.dirSync({unsafeCleanup: true})
  try {
    const destArchive = path.join(tmpdir.name, paths.artifactFile)
    await download(paths.artifactUrl, destArchive)
    await unzipTo(destArchive, tmpdir.name)
    console.log("Download and unzip success")
    fs.mkdirpSync(destPath)

    for (let f of [plat.superBin]) {
      fs.moveSync(path.join(tmpdir.name, f), path.join(destPath, f), {
        overwrite: true,
      })
    }
  } finally {
    tmpdir.removeCallback()
  }
}

async function devBuild(destPath) {
  if (!(process.platform in platformDefs)) {
    throw new Error("unsupported platform")
  }
  const plat = platformDefs[process.platform]

  const packageDir = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "node_modules",
    "super"
  )

  fs.mkdirpSync(destPath)

  for (let f of [plat.superBin]) {
    fs.copyFileSync(path.join(packageDir, "dist", f), path.join(destPath, f))
  }
}

async function main() {
  try {
    // The Zed dependency should be a git tag or commit. Any tag that
    // begins with "v*" is expected to be a released artifact, and will
    // be downloaded from the Zed repository. Otherwise, copy Zed
    // artifacts from node_modules via zedDevBuild.
    const version = packageJSON.devDependencies.super.split("#")[1]
    if (version.startsWith("v")) {
      await artifactsDownload(version, depsDir)
      console.log("downloaded artifacts version " + version)
    } else {
      await devBuild(depsDir)
      // Print the version inside zq derived during prepack as
      // opposed to what's in package.json.
      let realVersion = child_process
        .execSync(path.join(depsDir, "super") + " -version")
        .toString()
        .trim()
      console.log("copied artifacts " + realVersion)
    }
  } catch (err) {
    console.error("setup: ", err)
    process.exit(1)
  }
}

main()
