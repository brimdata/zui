import React from "react"
import {Toaster as HotToaster} from "react-hot-toast"

const Toaster = () => {
  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        role: "status",
        className: "toaster",
        loading: {
          // This is so that the loading indicator does not go away.
          duration: 2 ** 31 - 1,
        },
        success: {
          duration: 6000,
        },
      }}
    />
  )
}

export default Toaster
