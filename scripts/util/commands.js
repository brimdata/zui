const JS =
  'babel . -d dist -x ".ts,.tsx" --ignore "**/*test.ts,**/__mocks__/**" --quiet'

const SCSS = "node-sass-chokidar src --output dist --quiet"

const STATIC = 'cpx "src/static/**" dist/static'
const PLUGIN_STATIC = 'cpx "plugins/**/static/**" dist/plugins'
const HTML = 'cpx "{*.html,src/**/*.html}" dist'

module.exports = {JS, SCSS, STATIC, PLUGIN_STATIC, HTML}
