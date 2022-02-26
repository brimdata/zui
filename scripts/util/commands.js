const JS = "swc src -d dist"

const SCSS = "node-sass-chokidar src --output dist"

const STATIC = 'cpx "src/static/**" dist/static'
const PLUGIN_STATIC = 'cpx "src/plugins/**/static/**" dist/plugins'
const HTML = 'cpx "{*.html,src/**/*.html}" dist'

module.exports = {JS, SCSS, STATIC, PLUGIN_STATIC, HTML}
