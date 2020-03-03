/* @noflow */

const fs = require("fs-extra")
const got = require("got")
const path = require("path")
const tmp = require("tmp")
const {unzip} = require("cross-unzip")
const brimPackage = require("../../package.json")

const zdepsPath = path.resolve("zdeps")

const platformDefs = {
  darwin: {
    zqdBin: "zqd",
    zeekBin: "zeek",
    osarch: "darwin-amd64"
  },
  linux: {
    zqdBin: "zqd",
    zeekBin: "zeek",
    osarch: "linux-amd64"
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

  const artifactFile = `zeek-${version}.${plat.osarch}.zip`
  const artifactUrl = `https://github.com/brimsec/zeek/releases/download/${version}/${artifactFile}`
  const zeekPath = path.join(zdepsPath, "zeek")
  const zeekBinPath = path.join(zdepsPath, "zeek", plat.zeekBin)

  const tmpdir = tmp.dirSync({unsafeCleanup: true})
  try {
    const destArchive = path.join(tmpdir.name, artifactFile)
    await download(artifactUrl, destArchive)

    fs.removeSync(zeekPath)
    await unzipTo(destArchive, zdepsPath)
    if (!fs.pathExistsSync(zeekPath)) {
      throw new Error("zeek artifact zip file has unexpected layout")
    }
    if (!fs.pathExistsSync(zeekBinPath)) {
      throw new Error("zeek executable not found in download")
    }
  } finally {
    tmpdir.removeCallback()
  }

  return zeekBinPath
}

async function main() {
  try {
    // We encode the zeek version here for now to avoid the unncessary
    // git clone if it were in package.json.
    const zeekVersion = "vBrimReleaseWorkflowTest-brim"

    const zeekLocation = await zeekDownload(zeekVersion, zdepsPath)
    console.log("zeek " + zeekVersion + " downloaded to " + zeekLocation)

    // zqd version comes from package.json ("brimsec/zq#<version>")
    const zqdVersion = brimPackage.dependencies.zq.split("#")[1]

    const zqdLocation = await zqdDownload(zqdVersion, zdepsPath)
    console.log("zqd " + zqdVersion + " downloaded to " + zqdLocation)
  } catch(err) {
    console.error("zdeps setup: ", err)
    process.exit(1)
  }
}

main()
