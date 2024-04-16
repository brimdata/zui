const { execSync } = require('child_process');
const zuiPackage = require('./package.json')

const config = {
  appId: "io.brimdata.zui",
  asar: true,
  asarUnpack: ["zdeps", "LICENSE.txt", "acknowledgments.txt", "**/*.node"],
  directories: {output: "../../dist/apps/zui"},
  protocols: [{name: "zui", "schemes": ["zui"]}],
  win: {target: ["nsis"]},
  linux: {target: ["deb", "rpm"]},
  rpm: {depends: ["openssl"]},
  deb: {depends: ["openssl"]},
  nsis: {oneClick: false, perMachine: false},
  forceCodeSigning: true,
  afterSign: "electron-builder-notarize",
  publish: {
    provider: "github"
  },
  files: [
    "dist/**",
    "out/**",
    "build/**",
    "zdeps/**",
    "LICENSE.txt",
    "acknowledgments.txt",
    "package.json"
  ],
}

// Code below for code signing with SSL.com cert in electron-builder via GitHub
// Actions taken from:
// https://github.com/electron-userland/electron-builder/issues/6158#issuecomment-1994110062
if (process.env.CODE_SIGN_SCRIPT_PATH) {
  const version = zuiPackage.version;
  const productName = zuiPackage.productName;
  const versionedExe = `${productName} Setup ${version}.exe`;

  config.win.sign = (configuration) => {
    console.log("Requested signing for ", configuration.path);

    // Only proceed if the versioned exe file is in the configuration path - skip signing everything else
    if (!configuration.path.includes(versionedExe)) {
      console.log("Configuration path does not include the versioned exe, signing skipped.");
      return true;
    }

    const scriptPath = process.env.CODE_SIGN_SCRIPT_PATH;

    try {
      // Execute the sign script synchronously
      const output = execSync(`node "${scriptPath}"`).toString();
      console.log(`Script output: ${output}`);
    } catch (error) {
      console.error(`Error executing script: ${error.message}`);
      if (error.stdout) {
        console.log(`Script stdout: ${error.stdout.toString()}`);
      }
      if (error.stderr) {
        console.error(`Script stderr: ${error.stderr.toString()}`);
      }
      return false;
    }

    return true; // Return true at the end of successful signing
  };

  // Sign only for Windows 10 and above
  config.win.signingHashAlgorithms = ["sha256"];

}

module.exports = config;
