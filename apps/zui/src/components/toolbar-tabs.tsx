import React, {
  CSSProperties,
  Fragment,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import {MenuItem} from "src/core/menu"
import styles from "./toolbar-tabs.module.css"
import {Icon} from "src/components/icon"
import {call} from "src/util/call"

function isScaled(el) {
  const diff = el.clientWidth - el.getBoundingClientRect().width
  return Math.floor(Math.abs(diff)) !== 0
}

let time = null
function startTimer() {
  if (time === null) time = new Date()
}

function cancelTimer() {
  time = null
}

function checkTimer() {
  const ellapsed = new Date().getTime() - time.getTime()
  if (ellapsed > 10 * 1000) {
    throw new Error("Expected Scaling to Be Finished After 10 Seconds")
  }
}

export function ToolbarTabs(props: {
  onlyIcon?: boolean
  labelClassName?: string
  name: string
  options: MenuItem[]
  style?: CSSProperties
}) {
  const changeCount = useRef(0)
  const ref = useRef<HTMLDivElement>()
  const [pos, setPos] = useState({x: 0, width: 10})
  const pressedIndex = props.options.findIndex((opt) => opt.checked)

  function run() {
    const el = ref.current
    if (el) {
      if (isScaled(el)) {
        // Warn the developer if this remains scaled for longer than 10s
        startTimer()
        checkTimer()
        // We're being scaled, run this again after the transition completes
        requestAnimationFrame(run)
      } else {
        cancelTimer()
      }

      const parent = el.getBoundingClientRect()
      const pressed = el.querySelector(`[aria-pressed="true"]`)
      if (pressed) {
        const button = pressed.getBoundingClientRect()
        const x = button.x - parent.x
        const width = button.width
        setPos({x, width})
      }
    }
  }

  useLayoutEffect(run, [pressedIndex, props.onlyIcon])

  return (
    <div className={styles.tabs} style={props.style}>
      <nav className={styles.nav} ref={ref}>
        {props.options.map((opts, i) => (
          <Fragment key={opts.id ?? i}>
            <input
              type="radio"
              name={props.name}
              id={props.name + "_" + opts.label}
              value={opts.label}
              style={{display: "none"}}
              checked={opts.checked}
              readOnly
            />
            <button
              type="button"
              data-tooltip={props.onlyIcon ? opts.label : null}
              className={styles.button}
              onClick={() => {
                changeCount.current += 1
                call(opts.click)
              }}
              aria-pressed={opts.checked}
              aria-label={opts.label}
              data-section-tab-value={opts.label.toLowerCase()}
              disabled={opts.enabled === false}
            >
              {opts.iconName && <Icon name={opts.iconName} size="14px" />}
              {!props.onlyIcon && (
                <span className={props.labelClassName}>{opts.label}</span>
              )}
            </button>
          </Fragment>
        ))}
      </nav>
      <div
        className={styles.selection}
        style={{
          transform: `translateX(${pos.x}px)`,
          width: pos.width,
          transition:
            changeCount.current === 0 ? "none" : "width 200ms, transform 200ms",
          visibility: "visible",
        }}
      />
    </div>
  )
}
