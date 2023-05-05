import pkg from "../../../package.json"

const currentZedTag = pkg.devDependencies.zed.split("#")[1] || "main"
const zedDocsTag = currentZedTag.startsWith("v") ? currentZedTag : "next"

export default {
  ZED_DOCS_ROOT: `https://zed.brimdata.io/docs/${zedDocsTag}/commands/zed`,
  ZED_DOCS_LANGUAGE: `https://zed.brimdata.io/docs/${zedDocsTag}/language`,
  ZED_DOCS_FORMATS_ZJSON: `https://zed.brimdata.io/docs/${zedDocsTag}/formats/zjson`,
  ZED_DOCS_FORMATS_ZNG: `https://zed.brimdata.io/docs/${zedDocsTag}/formats/zng`,
  ZED_DOCS_FORMATS_ZSON: `https://zed.brimdata.io/docs/${zedDocsTag}/formats/zson`,
  ZED_DOCS_FORMATS_VNG: `https://zed.brimdata.io/docs/${zedDocsTag}/formats/vng`,
  ZUI_DOCS_ROOT: `https://zui.brimdata.io/docs`,
  ZUI_DOCS_CONNNECTION_TROUBLESHOOTING: `https://zui.brimdata.io/docs/support/Troubleshooting#zui-shows-an-error-the-service-could-not-be-reached`,
  ZUI_DOWNLOAD: `https://www.brimdata.io/download/`,
}
