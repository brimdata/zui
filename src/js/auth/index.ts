import jwtDecode from "jwt-decode"
import url from "url"
import authVars from "../../../hidden/auth0"
import keytar from "keytar"
import os from "os"
import got from "got"
import log from "electron-log"

const {apiIdentifier, auth0Domain, clientId} = authVars

const redirectUri = "brim:///"

const keytarService = "brim-openid-oauth"
const keytarAccount = os.userInfo().username

let accessToken = null
let profile = null
let refreshToken = null

export function getAccessToken() {
  return accessToken
}

export function getProfile() {
  return profile
}

export function getAuthenticationURL() {
  return (
    "https://" +
    auth0Domain +
    "/authorize?" +
    "audience=" +
    apiIdentifier +
    "&" +
    "scope=openid profile offline_access&" +
    "response_type=code&" +
    "client_id=" +
    clientId +
    "&" +
    "redirect_uri=" +
    redirectUri
  )
}

export async function refreshTokens() {
  const refreshToken = await keytar.getPassword(keytarService, keytarAccount)

  if (refreshToken) {
    try {
      const data = await got.post(`https://${auth0Domain}/oauth/token`, {
        headers: {
          "content-type": "application/json"
        },
        json: {
          grant_type: "refresh_token",
          client_id: clientId,
          refresh_token: refreshToken
        },
        responseType: "json"
      })

      const {body} = data
      log.info("refresh data body is: ", body)
      // @ts-ignore
      accessToken = body.access_token
      // @ts-ignore
      profile = jwtDecode(body.id_token)
    } catch (error) {
      await logout()

      throw error
    }
  } else {
    throw new Error("No available refresh token.")
  }
}

export async function loadTokens(callbackURL) {
  const urlParts = url.parse(callbackURL, true)
  const query = urlParts.query

  const exchangeOptions = {
    grant_type: "authorization_code",
    client_id: clientId,
    code: query.code,
    redirect_uri: redirectUri
  }

  const fetchUrl = `https://${auth0Domain}/oauth/token`

  try {
    const data = await got.post(fetchUrl, {
      headers: {
        "content-type": "application/json"
      },
      json: exchangeOptions,
      responseType: "json"
    })
    const {body} = data

    log.info("loadToken data body is: ", body)

    // @ts-ignore
    accessToken = body.access_token
    // @ts-ignore
    profile = jwtDecode(body.id_token)
    // @ts-ignore
    refreshToken = body.refresh_token

    if (refreshToken) {
      await keytar.setPassword(keytarService, keytarAccount, refreshToken)
    }
  } catch (error) {
    await logout()

    throw error
  }
}

export async function logout() {
  await keytar.deletePassword(keytarService, keytarAccount)
  accessToken = null
  profile = null
  refreshToken = null
}

export function getLogOutUrl(): string {
  return `https://${auth0Domain}/v2/logout`
}
