const JS =
  'babel . -d dist -x ".ts,.tsx" --ignore "**/*test.ts,**/__mocks__/**,itest,test" --quiet'

const SCSS = "node-sass-chokidar src --output dist --quiet"

const STATIC = 'cpx "src/static/**" dist/static'

module.exports = {JS, SCSS, STATIC}
