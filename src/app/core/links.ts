import * as brimPackage from "../../../package.json"

const currentZedTag = brimPackage.dependencies.zed.split("#")[1] || "main"
const zedDocsTag = currentZedTag.startsWith("v") ? currentZedTag : "next"

export default {
  ZED_DOCS_ROOT: `https://zed.brimdata.io/docs/${zedDocsTag}/commands/zed`,
  ZED_DOCS_LANGUAGE: `https://zed.brimdata.io/docs/${zedDocsTag}/language`,
  ZED_DOCS_FORMATS_ZNG: `https://zed.brimdata.io/docs/${zedDocsTag}/formats/zng`,
  ZED_DOCS_FORMATS_ZSON: `https://zed.brimdata.io/docs/${zedDocsTag}/formats/zson`,
  ZED_DOCS_FORMATS_ZST: `https://zed.brimdata.io/docs/${zedDocsTag}/formats/zst`,
}
