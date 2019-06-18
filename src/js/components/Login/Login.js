/* @flow */
import React from "react"

export default function Login() {
  return (
    <div className="login">
      <aside>
        <div className="company-name">
          <h1>Looky</h1>
        </div>
        <div className="saved-creds">
          <h3>Saved</h3>
          <ul>
            <li>
              <a>
                localhost:9868
                <br />
                jkerr
              </a>
            </li>
          </ul>
        </div>
      </aside>
      <main>
        <div className="login-form">
          <h1>Login</h1>
          <form className="form">
            <div>
              <label htmlFor="host">Host:</label>
              <input autoFocus name="host" type="text" />
            </div>
            <div>
              <label htmlFor="port">Port:</label>
              <input name="port" type="text" />
            </div>
            <div>
              <label htmlFor="username">Username:</label>
              <input name="username" type="text" />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input name="password" type="password" />
            </div>
            <div>
              <label className="checkbox-label">
                <input name="save" type="checkbox" /> Save these credentials.
              </label>
            </div>
            <div>
              <input type="submit" value="Connect" />
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
