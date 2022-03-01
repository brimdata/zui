import * as brimPackage from "../../../package.json"

const currentZedTag = brimPackage.dependencies.zed.split("#")[1] || "main"

export default {
  ZED_DOCS_ROOT: `https://github.com/brimdata/zed/blob/${currentZedTag}/docs/zed/README.md`,
  ZED_DOCS_LANGUAGE: `https://github.com/brimdata/zed/blob/${currentZedTag}/docs/zq/language.md`,
  ZED_DOCS_FORMATS_ZNG: `https://github.com/brimdata/zed/blob/${currentZedTag}/docs/formats/zng.md`,
  ZED_DOCS_FORMATS_ZSON: `https://github.com/brimdata/zed/blob/${currentZedTag}/docs/formats/zson.md`,
  ZED_DOCS_FORMATS_ZST: `https://github.com/brimdata/zed/blob/${currentZedTag}/docs/formats/zst.md`
}
