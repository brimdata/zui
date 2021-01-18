import jwtDecode from "jwt-decode"
import url from "url"
import keytar from "keytar"
import os from "os"
import got from "got"
import {shell} from "electron"
import "regenerator-runtime/runtime"

export class Authenticator {
  private accessToken: string
  private refreshToken: string
  private profile: any

  private apiIdentifier = "https://app.brimsecurity.com"
  private redirectUri = "brim:///"

  private keytarServiceSuffix = "-brim-oath"
  private keytarAccount = os.userInfo().username

  constructor(
    private workspaceUrl: string,
    private clientId: string,
    private auth0Domain: string
  ) {}

  getAccessToken(): string {
    return this.accessToken
  }

  // TODO: where will we use profile?
  getProfile(): string {
    return this.profile
  }

  login(): Promise<void> {
    return shell.openExternal(
      "https://" +
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
        this.redirectUri
    )
  }

  private getKeytarService(): string {
    const service = `${this.workspaceUrl}${this.keytarServiceSuffix}`
    // TODO: MASON - remove me
    console.log("keytar service is: ", service)
    return service
  }

  async refreshTokens(): Promise<void> {
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
  }

  async loadTokens(callbackURL): Promise<void> {
    const urlParts = url.parse(callbackURL, true)
    const query = urlParts.query

    const exchangeOptions = {
      grant_type: "authorization_code",
      client_id: this.clientId,
      code: query.code,
      redirect_uri: this.redirectUri
    }

    const fetchUrl = `https://${this.auth0Domain}/oauth/token`

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
        console.log("setting password: ", this.getKeytarService())
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
  }

  async logout(): Promise<void> {
    await keytar.deletePassword(this.getKeytarService(), this.keytarAccount)
    this.accessToken = null
    this.profile = null
    this.refreshToken = null
  }

  // getLogOutUrl(): string {
  //   return `https://${this.auth0Domain}/v2/logout`
  // }
}
