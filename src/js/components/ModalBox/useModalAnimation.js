/* @flow */
import useAnime from "../../hooks/useAnime"

export default function useModalAnimation(
  duration: number,
  willUnmount: boolean
) {
  useAnime(
    {
      autoplay: false,
      targets: ".modal-overlay",
      backgroundColor: ["rgba(0,0,0,0.0)", "rgba(0,0,0,0.4)"],
      easing: "linear",
      duration
    },
    willUnmount
  )

  useAnime(
    {
      targets: ".modal-contents",
      opacity: {
        value: [0, 1],
        easing: "easeInOutSine",
        duration
      },
      scale: [0.8, 1],
      duration,
      easing: "easeInOutSine"
    },
    willUnmount
  )
}
