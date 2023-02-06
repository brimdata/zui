import {shell} from "electron"

interface Auth0Response {
  access_token: string
  refresh_token?: string
}

export default class Auth0Client {
  private audience = "https://lake.brimdata.io"
  private redirectUri = "zui://auth/auth0/callback"
  // 'offline_access' ensures we receive a refresh_token
  private scope = "openid offline_access"

  constructor(private clientId: string, private auth0Domain: string) {}

  openLoginUrl(state: string): Promise<void> {
    const loginUrl = new URL("authorize", this.auth0Domain)

    loginUrl.searchParams.append("audience", this.audience)
    loginUrl.searchParams.append("scope", this.scope)
    // 'code' here specifies the PKCE (proof key code exchange) oauth flow
    loginUrl.searchParams.append("response_type", "code")
    loginUrl.searchParams.append("client_id", this.clientId)
    loginUrl.searchParams.append("redirect_uri", this.redirectUri)
    loginUrl.searchParams.append("prompt", "login")
    loginUrl.searchParams.append("state", state)

    return shell.openExternal(loginUrl.toString())
  }

  private getTokenURL(): string {
    return new URL("oauth/token", this.auth0Domain).toString()
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const refreshOptions = {
        grant_type: "refresh_token",
        client_id: this.clientId,
        refresh_token: refreshToken,
      }
      const res = await fetch(this.getTokenURL(), {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(refreshOptions),
      })
      const body = await res.json()

      return body.access_token
    } catch (error) {
      throw new Error("Failed to refresh access token: " + error)
    }
  }

  async exchangeCode(
    code: string
  ): Promise<{accessToken: string; refreshToken: string}> {
    const exchangeOptions = {
      grant_type: "authorization_code",
      client_id: this.clientId,
      code,
      redirect_uri: this.redirectUri,
    }

    try {
      const res = await fetch(this.getTokenURL(), {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(exchangeOptions),
      })

      const body: Auth0Response = await res.json()

      const {access_token: accessToken, refresh_token: refreshToken} = body

      return {accessToken, refreshToken}
    } catch (error) {
      throw new Error("Failed to exchange code: " + error)
    }
  }
}
