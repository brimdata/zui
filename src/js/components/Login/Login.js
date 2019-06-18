/* @flow */
import React, {useState} from "react"

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

export default function Login() {
  // Global state
  let [saved, setSaved] = useState([])
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
    return Promise.reject("This is bad!")
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
          <h1>Looky</h1>
        </div>
        <div className="saved-creds">
          <h3>Saved</h3>
          <ul>
            {saved.map((creds) => (
              <li key={creds.host + creds.port + creds.username}>
                <a onClick={() => login(creds)}>
                  {creds.host}:{creds.port}
                  <br />
                  {creds.username}
                </a>
                <a onClick={() => deleteCreds(creds)}>Delete</a>
              </li>
            ))}
          </ul>
          {saved.length === 0 && <p>No saved connections.</p>}
        </div>
        <button onClick={logout}>Logout</button>
      </aside>
      <main>
        <div className="login-form">
          <h1>Login</h1>
          <form className="form" onSubmit={onSubmit}>
            <div>
              <label htmlFor="host">Host:</label>
              <input
                defaultValue={current.host}
                autoFocus
                name="host"
                type="text"
              />
            </div>
            <div>
              <label htmlFor="port">Port:</label>
              <input defaultValue={current.port} name="port" type="text" />
            </div>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                defaultValue={current.username}
                name="username"
                type="text"
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                defaultValue={current.password}
                name="password"
                type="password"
              />
            </div>
            <div>
              <label className="checkbox-label">
                <input name="save" type="checkbox" defaultChecked="true" /> Save
                these credentials.
              </label>
            </div>
            <div>
              <input type="submit" value="Connect" />
            </div>
            {error.length > 0 && <p>{error}</p>}
          </form>
          <p>{loggedIn ? "Logged In" : "Logged Out"}</p>
          <code>{JSON.stringify(current)}</code>
        </div>
      </main>
    </div>
  )
}
