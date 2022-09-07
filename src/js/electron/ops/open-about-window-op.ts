import {createOperation} from "../operations"

export const openAboutWindowOp = createOperation(
  "openAboutWindow",
  ({main}) => {
    const about = main.windows.all.find((w) => w.name === "about")
    if (about) {
      about.ref.focus()
    } else {
      main.windows.create("about")
    }
  }
)
