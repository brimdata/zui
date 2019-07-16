/* @flow */

export function animatePopMenu(menu: *, position: string) {
  if (position.includes("top")) {
    menu.animate(popDown, settings)
  } else {
    menu.animate(popUp, settings)
  }
}

let settings = {
  duration: 100,
  easing: "cubic-bezier(0,0,1,1)"
}

let popUp = [
  {transform: "scale(1) translateY(-18px)", opacity: 0.25},
  {transform: "scale(1) translateY(2px)", opacity: 0.5, offset: 0.25},
  {opacity: 1},
  {transform: "scale(1) translateY(0px)"}
]

let popDown = [
  {transform: "scale(1) translateY(18px)", opacity: 0.25},
  {transform: "scale(1) translateY(-2px)", opacity: 0.5, offset: 0.25},
  {opacity: 1},
  {transform: "scale(1) translateY(0px)"}
]
