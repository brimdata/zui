const {execSync} = require("child_process")
const artifact = require("./artifact")

// Code below for code signing with SSL.com cert in electron-builder via GitHub
// Inspired from this comment:
// https://github.com/electron-userland/electron-builder/issues/6158#issuecomment-1994110062

function sign() {
  const scriptPath = process.env.CODE_SIGN_SCRIPT_PATH
  process.env.INPUT_COMMAND = "sign"
  process.env.INPUT_OVERRIDE = "true"
  process.env.INPUT_MALWARE_BLOCK = "false"
  process.env.INPUT_CLEAN_LOGS = "false"
  process.env.INPUT_JVM_MAX_MEMORY = "1024M"
  process.env.INPUT_ENVIRONMENT_NAME = "PROD"

  try {
    const output = execSync(`node "${scriptPath}"`).toString()
    console.log(`Signing Output: ${output}`)
    return true
  } catch (error) {
    console.error(`Signing Error: ${error.message}`)
    if (error.stdout) {
      console.log(`Signing Stdout: ${error.stdout.toString()}`)
    }
    if (error.stderr) {
      console.error(`Signing Stderr: ${error.stderr.toString()}`)
    }
    return false
  }
}

function shouldSign(filePath) {
  if (filePath !== artifact.path) {
    console.log("Signing Skipped: path not in whitelist '", filePath, "'")
    return false
  }
  if (filePath === artifact.path) {
    console.log("Signing Started: '" + filePath + "'")
    return true
  }
}

exports.default = async function (configuration) {
  if (!process.env.CODE_SIGN_SCRIPT_PATH) {
    console.log(
      "Signing Skipped: no script path provided in CODE_SIGN_SCRIPT_PATH"
    )
    return true
  }
  if (shouldSign(configuration.path)) {
    return sign()
  } else {
    return true
  }
}
