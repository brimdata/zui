import jwtDecode from "jwt-decode"
import url from "url"
import keytar from "keytar"
import os from "os"
import got from "got"
import {shell} from "electron"
// import "regenerator-runtime/runtime"

const audience = "https://app.brimsecurity.com"
const redirectUri = "brim://auth0/callback"

const keytarServiceSuffix = "brim-oauth"

export const toAccessTokenKey = (id: string) =>
  [id, "AT", keytarServiceSuffix].join("-")
export const toRefreshTokenKey = (id: string) =>
  [id, "RT", keytarServiceSuffix].join("-")

const Auth0 = ()

export class Authenticator {
  private accessToken: string
  private refreshToken: string
  private profile: any

  private apiIdentifier = "https://app.brimsecurity.com"
  private redirectUri = "brim://callback"

  private keytarServiceSuffix = "-brim-oauth"
  private keytarAccount = os.userInfo().username

  constructor(
    private workspaceId: string,
    private clientId: string,
    private auth0Domain: string
  ) {}

  static serializeState(...stateItems: string[]): string {
    return stateItems.join(",")
  }
  static deserializeState(state: string): string[] {
    return state.split(",")
  }

  getAccessToken(): string {
    return this.accessToken
  }

  // TODO: where will we use profile?
  getProfile(): string {
    return this.profile
  }

  login(state: string): Promise<void> {
    const loginUrl =
      this.auth0Domain +
      "/authorize?" +
      "audience=" +
      this.apiIdentifier +
      "&" +
      "scope=openid profile offline_access&" +
      "response_type=code&" +
      "client_id=" +
      this.clientId +
      "&" +
      "redirect_uri=" +
      this.redirectUri +
      "&" +
      "state=" +
      state

    return shell.openExternal(loginUrl)
  }

  private getKeytarService(): string {
    const service = this.workspaceId + this.keytarServiceSuffix
    return service
  }

  async refreshTokens(): Promise<string> {
    this.refreshToken = await keytar.getPassword(
      this.getKeytarService(),
      this.keytarAccount
    )

    if (this.refreshToken) {
      try {
        const data = await got.post(`https://${this.auth0Domain}/oauth/token`, {
          headers: {
            "content-type": "application/json"
          },
          json: {
            grant_type: "refresh_token",
            client_id: this.clientId,
            refresh_token: this.refreshToken
          },
          responseType: "json"
        })

        const {body} = data
        // @ts-ignore
        this.accessToken = body.access_token
        // @ts-ignore
        this.profile = jwtDecode(body.id_token)
      } catch (error) {
        await this.logout()

        throw error
      }
    } else {
      throw new Error("No available refresh token.")
    }

    return this.accessToken
  }

  async loadTokens(callbackURL): Promise<string> {
    const urlParts = url.parse(callbackURL, true)
    const query = urlParts.query

    const exchangeOptions = {
      grant_type: "authorization_code",
      client_id: this.clientId,
      code: query.code,
      redirect_uri: this.redirectUri
    }

    const fetchUrl = `${this.auth0Domain}/oauth/token`

    try {
      const data = await got.post(fetchUrl, {
        headers: {
          "content-type": "application/json"
        },
        json: exchangeOptions,
        responseType: "json"
      })
      const {body} = data

      // TODO: define expected type for body
      // @ts-ignore
      this.accessToken = body.access_token
      // @ts-ignore
      this.profile = jwtDecode(body.id_token)
      // @ts-ignore
      this.refreshToken = body.refresh_token

      if (this.refreshToken) {
        await keytar.setPassword(
          this.getKeytarService(),
          this.keytarAccount,
          this.refreshToken
        )
      }
    } catch (error) {
      await this.logout()

      throw error
    }

    return this.accessToken
  }

  async logout(): Promise<void> {
    await keytar.deletePassword(this.getKeytarService(), this.keytarAccount)
    this.accessToken = null
    this.profile = null
    this.refreshToken = null
  }

  // getLogOutUrl(): string {
  //   return `${this.auth0Domain}/v2/logout`
  // }
}
