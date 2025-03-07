import pkg from "../../package.json"

const gitRef = pkg.devDependencies.super.split("#")[1] || "main"
const docsGitRef = gitRef.startsWith("v")
  ? gitRef.replace(/\.\d+$/, ".0")
  : "v1.18.0" // Change back to "next" when we make the zed->super transition

export default {
  DOCS_ROOT: `https://zed.brimdata.io/docs/${docsGitRef}/commands/zed`,
  DOCS_LANGUAGE: `https://zed.brimdata.io/docs/${docsGitRef}/language`,
  DOCS_FORMATS_ZJSON: `https://zed.brimdata.io/docs/${docsGitRef}/formats/zjson`,
  DOCS_FORMATS_ZNG: `https://zed.brimdata.io/docs/${docsGitRef}/formats/zng`,
  DOCS_FORMATS_ZSON: `https://zed.brimdata.io/docs/${docsGitRef}/formats/zson`,
  DOCS_FORMATS_VNG: `https://zed.brimdata.io/docs/${docsGitRef}/formats/vng`,
  DESKTOP_DOCS_ROOT: `https://zui.brimdata.io/docs`,
  DESKTOP_DOCS_CONNNECTION_TROUBLESHOOTING: `https://zui.brimdata.io/docs/support/Troubleshooting#zui-shows-an-error-the-service-could-not-be-reached`,
  DESKTOP_DOWNLOAD: `https://www.brimdata.io/download/`,
}
