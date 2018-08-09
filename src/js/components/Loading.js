import React from "react"

const palettes = [
  ["CCF390", "E0E05A", "F7C41F", "FC930A", "FF003D"],
  ["EDE7BE", "BDEECD", "A7BFA0", "929073", "7C6146"],
  ["B1E6D1", "77B1A9", "3D7B80", "270A33", "451A3E"],
  ["452632", "91204D", "E4844A", "E8BF56", "E2F7CE"],
  ["5C323E", "A82743", "E15E32", "C0D23E", "E5F04C"],
  ["FF3366", "C74066", "8F4D65", "575A65", "1F6764"],
  ["343838", "005F6B", "008C9E", "00B4CC", "00DFFC"],
  ["6DA67A", "99A66D", "A9BD68", "B5CC6A", "C0DE5D"],
  ["280904", "680E34", "9A151A", "C21B12", "FC4B2A"]
]

export default class Loading extends React.Component {
  componentDidMount() {
    this.animate()
  }

  componentWillUnMount() {
    clearInterval(this.interval)
  }

  animate() {
    let colors = palettes[Math.floor(Math.random() * palettes.length)]
    let palette = [
      colors[0],
      colors[1],
      colors[2],
      colors[3],
      colors[4],
      colors[3],
      colors[2],
      colors[1],
      colors[0]
    ]
    let squareElements = document.querySelectorAll(".loader .square")
    let squares = [
      squareElements[0],
      squareElements[1],
      squareElements[2],
      squareElements[5],
      squareElements[8],
      squareElements[7],
      squareElements[6],
      squareElements[3],
      squareElements[4]
    ]

    function iterateColors() {
      for (var i = 0; i < palette.length; i++) {
        squares[i].style.backgroundColor = "#" + palette[i]
      }

      // Move last item in array to first
      palette.splice(0, 0, palette.splice(palette.length - 1, 1)[0])
    }

    iterateColors()
    this.interval = setInterval(iterateColors, 50)
  }

  render() {
    return (
      <div className="loader">
        <div className="square" />
        <div className="square" />
        <div className="square" />
        <div className="square" />
        <div className="square" />
        <div className="square" />
        <div className="square" />
        <div className="square" />
        <div className="square" />
      </div>
    )
  }
}
