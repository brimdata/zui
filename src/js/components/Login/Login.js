/* @flow */
import {isEmpty} from "lodash"
import React, {useState} from "react"
import classNames from "classnames"

import {Dots} from "./Dots"

// Goes in Forms StdLib File
function getFormData(form, ...fields) {
  return fields.reduce((data, name) => {
    let el = form.elements.namedItem(name)
    switch (el.type) {
      case "checkbox":
        data[name] = el.checked
        break
      default:
        data[name] = el.value
        break
    }
    return data
  }, {})
}

const SAVED = [
  {
    host: "localhost",
    port: "9867",
    username: "jkerr",
    password: "123"
  },
  {
    host: "boom.demo.looky.cloud",
    port: "8080",
    username: "root",
    password: "123"
  },
  {
    host: "prod.host.google.com",
    port: "9867",
    username: "admin",
    password: "123"
  }
]

export default function Login() {
  // Global state
  let [saved, setSaved] = useState(SAVED)
  let [current, setCurrent] = useState({})
  let [loggedIn, setLoggedIn] = useState(false)

  // Local state
  let [error, setError] = useState("")

  // Local func
  function onSubmit(e) {
    e.preventDefault()
    let creds = getFormData(e.target, "host", "port", "username", "password")
    let {save} = getFormData(e.target, "save")
    login(creds)
      .then(() => {
        if (save) saveCreds(creds)
      })
      .catch((e) => setError(e))
  }

  // Goes in creds lib file
  function getCredKey({host, port, username}) {
    return [host, port, username].join(":")
  }

  // Goes in creds reducer
  function findCreds(creds) {
    return saved.find((c) => getCredKey(c) === getCredKey(creds))
  }

  // Goes in creds reducer
  function saveCreds(creds) {
    if (findCreds(creds)) {
      return
    } else {
      setSaved([...saved, creds])
    }
  }

  // Goes in creds reducer
  function deleteCreds(creds) {
    setSaved(saved.filter((c) => getCredKey(c) !== getCredKey(creds)))
  }

  // Goes in connection thunks
  function login(creds) {
    // return Promise.reject("This is bad!")
    setCurrent(creds)
    setLoggedIn(true)
    return Promise.resolve()
  }

  // Goes in connection thunks
  function logout() {
    setCurrent({})
    setLoggedIn(false)
  }

  return (
    <div className="login">
      <aside>
        <div className="company-name">
          <svg className="company-name-bg" viewBox="0 0 200 168">
            <defs>
              <linearGradient
                x1="50%"
                y1="0%"
                x2="50%"
                y2="99.646326%"
                id="linearGradient-1"
              >
                <stop stopColor="#606474" offset="0%" />
                <stop stopColor="#484C58" offset="100%" />
              </linearGradient>
            </defs>
            <g id="Artboard" fill="url(#linearGradient-1)">
              <path
                d="M0,160 C100,140 100,180 200,160 L200,0 L0,0 L0,100 Z"
                id="Path-2-Copy-2"
              />
            </g>
          </svg>
          <div className="company-name-text">
            <h1>Looky</h1>
          </div>
        </div>
        <div className="saved-creds">
          <h3>Saved</h3>
          <ul>
            {saved.map((creds) => (
              <li
                key={creds.host + creds.port + creds.username}
                onClick={() => login(creds)}
              >
                <svg
                  className="star"
                  width="24px"
                  height="23px"
                  viewBox="0 0 24 23"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.918572,21.957364 C19.3764124,22.1922337 18.8989534,22.5482695 18.5203486,22.9913178 L12.489251,18.5745334 L17.638444,14.8112287 L19.918572,21.957364 Z M24.0395526,9.32991886 L17.9773701,13.7604849 L16.0396396,7.68745563 L23.5123951,7.68745563 C23.5623877,8.28403347 23.7484914,8.84190576 24.0395526,9.32991886 Z M11.1596381,-0.11801067 C11.4557471,-0.0449898018 11.7653554,-0.00625336607 12.0840111,-0.00625336607 C12.3583375,-0.00625336607 12.6259586,-0.0349619249 12.884034,-0.0895385536 L15.1573911,7.03537599 L8.86700696,7.03537599 L11.1596381,-0.11801067 Z M-0.0413250002,9.39795297 C0.273562744,8.89402187 0.475039392,8.31194476 0.527370938,7.68745563 L7.98354237,7.68745563 L6.01407064,13.8325316 L-0.0413250002,9.39795297 Z M5.60019645,22.806383 C5.20383839,22.3597321 4.70512251,22.0059673 4.14081938,21.7818593 L6.35174277,14.8834143 L11.3912159,18.5739973 L5.60019645,22.806383 Z M11.9404231,18.1726075 L6.56033293,14.2325787 L8.6580181,7.68745563 L15.3654511,7.68745563 L17.4306692,14.160043 L11.9404231,18.1726075 Z" />
                </svg>
                <div>
                  <span className="host">{creds.host}</span>:
                  <span className="port">{creds.port}</span>
                  <br />
                  <span className="username">
                    {creds.username || "(no user)"}
                  </span>
                </div>
                <svg
                  className="arrow"
                  width="100px"
                  height="10px"
                  viewBox="0 0 100 10"
                  version="1.1"
                >
                  <g stroke="none" strokeWidth="1" fill="none">
                    <path
                      id="Line"
                      d="M91.5,5.5 L-0.5,5.5 L-0.5,4.5 L91.5,4.5 L91.5,0.5 L100.5,5 L91.5,9.5 L91.5,5.5 Z"
                      fill="#EA6B45"
                      fillRule="nonzero"
                    />
                  </g>
                </svg>
                {/* <a onClick={() => deleteCreds(creds)}>Delete</a> */}
              </li>
            ))}
          </ul>
          {saved.length === 0 && (
            <p className="empty-message">No saved connections.</p>
          )}
        </div>
      </aside>
      <main>
        <div className="login-form">
          <h1>Login</h1>
          <form className="form" onSubmit={onSubmit}>
            <Input
              label="Host:"
              name="host"
              type="text"
              required
              autoFocus
              defaultValue={current.host}
            />
            <Input
              label="Port:"
              name="port"
              type="text"
              required
              defaultValue={current.port}
            />
            <Input
              label="Username:"
              name="username"
              type="text"
              defaultValue={current.username}
            />
            <Input
              label="Password:"
              name="password"
              type="password"
              defaultValue={current.password}
            />
            <InputCheckbox
              label="Save credentials"
              name="save"
              defaultChecked="true"
            />
            <InputSubmit value="Connect" />
            {error.length > 0 && <p>{error}</p>}
          </form>
        </div>
        <Dots />
      </main>
    </div>
  )
}

function Input({label, ...inputProps}) {
  let [focus, setFocus] = useState(false)
  let [empty, setEmpty] = useState(isEmpty(inputProps.defaultValue))

  function onFocus() {
    setFocus(true)
  }

  function onBlur() {
    setFocus(false)
  }

  function onChange(e) {
    setEmpty(isEmpty(e.target.value))
  }

  let classes = classNames("input", inputProps.type, {focus, empty})

  return (
    <div className={classes}>
      <label htmlFor={inputProps.name}>{label}</label>
      <input
        {...inputProps}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
      />
    </div>
  )
}

function InputCheckbox({label, ...inputProps}) {
  let [focus, setFocus] = useState(false)

  function onFocus() {
    setFocus(true)
  }

  function onBlur() {
    setFocus(false)
  }

  let classes = classNames("input-checkbox", {focus})

  return (
    <div className={classes}>
      <label>
        <input
          type="checkbox"
          {...inputProps}
          onFocus={onFocus}
          onBlur={onBlur}
        />{" "}
        {label}
      </label>
    </div>
  )
}

function InputSubmit({...inputProps}) {
  return (
    <div className="input-submit">
      <input type="submit" {...inputProps} />
    </div>
  )
}
