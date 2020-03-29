/* @noflow */

const fs = require("fs-extra")
const got = require("got")
const path = require("path")
const tmp = require("tmp")
const {unzip} = require("cross-unzip")
const {execSync} = require("child_process")
const brimPackage = require("../../package.json")

const zdepsPath = path.resolve("zdeps")

const platformDefs = {
  darwin: {
    zqdBin: "zqd",
    osarch: "darwin-amd64"
  },
  linux: {
    zqdBin: "zqd",
    osarch: "linux-amd64"
  },
  win32: {
    zqdBin: "zqd.exe",
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
    unzip(zipfile, dir, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function zqdArtifactPaths(version) {
  if (!(process.platform in platformDefs)) {
    throw new Error("unsupported platform")
  }
  const plat = platformDefs[process.platform]

  const artifactFile = `zq-${version}.${plat.osarch}.zip`
  const artifactUrl = `https://github.com/brimsec/zq/releases/download/${version}/${artifactFile}`
  const relativeBinPath = path.join(`zq-${version}.${plat.osarch}`, plat.zqdBin)

  return {
    artifactFile,
    artifactUrl,
    relativeBinPath,
    binName: plat.zqdBin
  }
}

// Download and extract the zqd binary for this platform to the specified
// directory. Returns the absolute path of the zqd binary file.
async function zqdDownload(version, destPath) {
  const paths = zqdArtifactPaths(version)
  const destBinLocation = path.join(destPath, paths.binName)

  const tmpdir = tmp.dirSync({unsafeCleanup: true})
  try {
    const destArchive = path.join(tmpdir.name, paths.artifactFile)
    await download(paths.artifactUrl, destArchive)
    await unzipTo(destArchive, tmpdir.name)

    const zqdBinPath = path.join(tmpdir.name, paths.relativeBinPath)
    fs.mkdirpSync(destPath)
    fs.moveSync(zqdBinPath, destBinLocation, {overwrite: true})
  } finally {
    tmpdir.removeCallback()
  }

  return destBinLocation
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
    artifactFile = "zeek.zip"
    artifactUrl =
      "https://storage.googleapis.com/brimsec/zeek-windows/zeek-20200624.zip"
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
async function zqdDevBuild(destPath) {
  if (!(process.platform in platformDefs)) {
    throw new Error("unsupported platform")
  }
  const plat = platformDefs[process.platform]
  const destBinLocation = path.join(destPath, plat.zqdBin)

  const zqPackageDir = path.join(__dirname, "..", "..", "node_modules", "zq")
  const zqBuiltBin = path.join(zqPackageDir, "dist", plat.zqdBin)

  execSync("make build", {
    stdio: "inherit",
    cwd: zqPackageDir
  })

  if (!fs.pathExistsSync(zqBuiltBin)) {
    throw new Error("zqd binary not built")
  }

  fs.moveSync(zqBuiltBin, destBinLocation, {overwrite: true})

  return destBinLocation
}

async function main() {
  try {
    // We encode the zeek version here for now to avoid the unncessary
    // git clone if it were in package.json.
    const zeekVersion = "v3.0.2-brim2"
    await zeekDownload(zeekVersion, zdepsPath)

    // The zq dependency should be a git tag or commit. Any tag that
    // begins with "v*" is expected to be a released artifact, and will
    // be downloaded from the zq repo release artifacts. Otherwise,
    // attempt to build it (via "make build"); this assumes that go tooling
    // is available.
    const zqdVersion = brimPackage.dependencies.zq.split("#")[1]
    if (zqdVersion.startsWith("v")) {
      const zqdLocation = await zqdDownload(zqdVersion, zdepsPath)
      console.log("downloaded zqd " + zqdVersion + " to " + zqdLocation)
    } else {
      const zqdLocation = await zqdDevBuild(zdepsPath)
      console.log("built zqd " + zqdVersion + " to " + zqdLocation)
    }
  } catch (err) {
    console.error("zdeps setup: ", err)
    process.exit(1)
  }
}

main()
