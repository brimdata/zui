module.exports = {
  "*.{js,ts,tsx}": [
    "eslint --cache --fix",
    "jest --project=unit --findRelatedTests --bail"
  ],
  "*.{js,ts,tsx,css,scss,html,md,json}": "prettier --write",
  "**/*.ts?(x)": () => "tsc -p tsconfig.json --noEmit"
}
