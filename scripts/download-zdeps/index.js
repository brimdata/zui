/* @noflow */

const child_process = require("child_process")
const fs = require("fs-extra")
const got = require("got")
const path = require("path")
const tmp = require("tmp")
const extract = require("extract-zip")
const brimPackage = require("../../package.json")

const zdepsPath = path.resolve("zdeps")

const platformDefs = {
  darwin: {
    zqdBin: "zqd",
    zqBin: "zq",
    osarch: "darwin-amd64"
  },
  linux: {
    zqdBin: "zqd",
    zqBin: "zq",
    osarch: "linux-amd64"
  },
  win32: {
    zqdBin: "zqd.exe",
    zqBin: "zq.exe",
    osarch: "windows-amd64"
  }
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
  return new Promise((resolve, reject) => {
    extract(zipfile, {dir: dir}, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function zqdArtifactPaths(version) {
  const plat = platformDefs[process.platform]

  const artifactFile = `zq-${version}.${plat.osarch}.zip`
  const artifactUrl = `https://github.com/brimsec/zq/releases/download/${version}/${artifactFile}`
  const internalTopDir = `zq-${version}.${plat.osarch}`

  return {
    artifactFile,
    artifactUrl,
    internalTopDir
  }
}

// Download and extract the zqd binary for this platform to the specified
// directory. Returns the absolute path of the zqd binary file.
async function zqArtifactsDownload(version, destPath) {
  const plat = platformDefs[process.platform]
  const paths = zqdArtifactPaths(version)

  const tmpdir = tmp.dirSync({unsafeCleanup: true})
  try {
    const destArchive = path.join(tmpdir.name, paths.artifactFile)
    await download(paths.artifactUrl, destArchive)
    await unzipTo(destArchive, tmpdir.name)

    fs.mkdirpSync(destPath)

    for (let f of [plat.zqdBin, plat.zqBin]) {
      fs.moveSync(
        path.join(tmpdir.name, paths.internalTopDir, f),
        path.join(destPath, f),
        {overwrite: true}
      )
    }
  } finally {
    tmpdir.removeCallback()
  }
}

async function zeekDownload(version, zdepsPath) {
  if (!(process.platform in platformDefs)) {
    throw new Error("unsupported platform")
  }
  const plat = platformDefs[process.platform]
  const zeekPath = path.join(zdepsPath, "zeek")

  let artifactFile, artifactUrl

  if (process.platform == "win32") {
    // Special casing for zeek on windows as it's not yet created automatically
    // like linux/mac.
    artifactFile = "zeek-dev-zeek-runner.zip"
    artifactUrl =
      "https://storage.cloud.google.com/brimsec/scratch/zeek-dev-zeek-runner.zip"
  } else {
    artifactFile = `zeek-${version}.${plat.osarch}.zip`
    artifactUrl = `https://github.com/brimsec/zeek/releases/download/${version}/${artifactFile}`
  }

  const tmpdir = tmp.dirSync({unsafeCleanup: true})
  try {
    const destArchive = path.join(tmpdir.name, artifactFile)
    await download(artifactUrl, destArchive)

    fs.removeSync(zeekPath)
    await unzipTo(destArchive, zdepsPath)
    if (!fs.pathExistsSync(zeekPath)) {
      throw new Error("zeek artifact zip file has unexpected layout")
    }
  } finally {
    tmpdir.removeCallback()
  }

  if (process.platform == "win32") {
    console.log("zeek windows artifact downloaded to " + zeekPath)
  } else {
    console.log("zeek " + version + " downloaded to " + zeekPath)
  }
}

// Build the zqd binary inside the node_modules/zq directory via "make build".
async function zqDevBuild(destPath) {
  if (!(process.platform in platformDefs)) {
    throw new Error("unsupported platform")
  }
  const plat = platformDefs[process.platform]

  const zqPackageDir = path.join(__dirname, "..", "..", "node_modules", "zq")

  for (let f of [plat.zqdBin, plat.zqBin]) {
    fs.copyFileSync(path.join(zqPackageDir, "dist", f), path.join(destPath, f))
  }
}

async function main() {
  try {
    // We encode the zeek version here for now to avoid the unncessary
    // git clone if it were in package.json.
    const zeekVersion = "dev-zeek-runner"
    await zeekDownload(zeekVersion, zdepsPath)

    // The zq dependency should be a git tag or commit. Any tag that
    // begins with "v*" is expected to be a released artifact, and will
    // be downloaded from the zq repo release artifacts. Otherwise,
    // attempt to build it (via "make build"); this assumes that go tooling
    // is available.
    const zqdVersion = brimPackage.dependencies.zq.split("#")[1]
    if (zqdVersion.startsWith("v")) {
      await zqArtifactsDownload(zqdVersion, zdepsPath)
      console.log("downloaded zq artifacts version " + zqdVersion)
    } else {
      await zqDevBuild(zdepsPath)
      // Print the version inside zq derived during prepack as
      // opposed to what's in package.json.
      let realZqVersion = child_process
        .execSync(path.join(zdepsPath, "zq") + " -version")
        .toString()
        .trim()
      console.log("copied zq artifacts " + realZqVersion)
    }
  } catch (err) {
    console.error("zdeps setup: ", err)
    process.exit(1)
  }
}

main()
