module.exports = {
  name: "@yarnpkg/plugin-github",
  factory: function (require) {
    // This dummy implementation overrides the builtin plugin, which
    // fetches a tarball from GitHub instead of cloning the repository.
    // Brimcap and Zed must be built in a cloned repository so the
    // resulting executables will produce meaningful output for the
    // -version flag.
    return {}
  }
};
