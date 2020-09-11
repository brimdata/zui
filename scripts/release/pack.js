/* @noflow */
const packager = require("electron-packager")

let opts = {
  dir: ".",
  out: "dist/packages",
  overwrite: true,
  name: "Brim"
}

module.exports = {
  darwin: function(sign) {
    var osxSign = false
    if (sign) {
      osxSign = {
        identity: "Developer ID",
        "gatekeeper-assess": false,
        hardenedRuntime: true,
        entitlements: "scripts/release/entitlements.mac.plist",
        "entitlements-inherit": "scripts/release/entitlements.mac.plist"
      }
    }
    return packager({
      ...opts,
      osxSign: osxSign,
      platform: "darwin",
      icon: "dist/static/AppIcon.icns"
    }).then(() => {
      console.log("Built package for darwin in " + opts.out)
    })
  },
  win32: function() {
    return packager({
      ...opts,
      platform: "win32",
      icon: "dist/static/AppIcon.ico"
    }).then(() => {
      console.log("Built package for win32 in " + opts.out)
    })
  },
  linux: function() {
    return packager({
      ...opts,
      platform: "linux"
    }).then(() => {
      console.log("Built package for linux in " + opts.out)
    })
  }
}
