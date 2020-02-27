/* @noflow */

const fs = require("fs-extra")
const got = require("got")
const path = require("path")
const tmp = require("tmp")
const { unzip } = require("cross-unzip")

// zqd version to download & use.
const zqdVersion = "v0.3.0"

// Path and filename for the zqd executable.
const zqdPath = ["zdeps"]
const platformDefs = {
  "linux": {
    zqdBin: "zqd",
    osarch: "linux-amd64",
  },
  "win32": {
    zqdBin: "zqd.exe",
    osarch: "windows-amd64",
  },
  "darwin": {
    zqdBin: "zqd",
    osarch: "darwin-amd64",
  }
}

async function download(url, targetfile) {
  await fs.mkdirp(path.dirname(targetfile))
  const writeStream = fs.createWriteStream(targetfile)
  return new Promise((resolve, reject) => {
    const gotStream = got.stream(url)
    gotStream.pipe(writeStream)
    gotStream.on("error", err => {
      if (writeStream.destroy) {
        writeStream.destroy(err)
      }
      reject(err)
    })
    writeStream.on("error", err => reject(err))
    writeStream.on("close", () => resolve())
  })
}

async function unzipTo(zipfile, dir) {
  await fs.mkdirp(dir)
  return new Promise((resolve, reject) => {
    unzip(zipfile, dir, err => {
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
    binName: plat.zqdBin,
  }
}

// Download and extract the zqd binary for this platform to the specified
// directory. Returns the absolute path of the zqd binary file.
async function zqdDownload(version, destPath) {
  const paths = zqdArtifactPaths(version)
  const destdir = path.join(...destPath)
  const destBinLocation = path.resolve(path.join(destdir, paths.binName))

  const tmpdir = tmp.dirSync({unsafeCleanup: true})
  try {
    const destArchive = path.join(tmpdir.name, paths.artifactFile)
    await download(paths.artifactUrl, destArchive)
    await unzipTo(destArchive, tmpdir.name)

    const zqdBinPath = path.join(tmpdir.name, paths.relativeBinPath)
    fs.mkdirpSync(destdir)
    fs.moveSync(zqdBinPath, destBinLocation, {overwrite: true})
  } finally {
    tmpdir.removeCallback()
  }

  return destBinLocation
}

zqdDownload(zqdVersion,zqdPath)
  .then((location) => {
    console.log("zqd " + zqdVersion + " downloaded to " + location)
  })
  .catch((err) => {
    console.error("zqd setup: ", err)
    process.exit(1)
  })
