import {defineConfig} from "cypress"

export default defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  e2e: {
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
})
