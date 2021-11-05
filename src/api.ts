import SparkMD5 from "spark-md5"
import { sortBy as _sortBy } from "lodash-es"

const apiKey: string = process.env.REACT_APP_LASTFM_KEY
const secret: string = process.env.REACT_APP_LASTFM_SECRET
if (!(apiKey && secret)) {
  throw new Error("Lastfm keys are missing")
}

interface RemoteError {
  error: number
  message: string
}

export class LfmError extends Error {
  code: number

  constructor(obj: RemoteError) {
    super(obj.message)
    this.code = obj.error
    this.name = this.constructor.name
  }
}

function constructUrl(method: string, params: any) {
  const url = new URL("https://ws.audioscrobbler.com/2.0/")

  url.searchParams.set("api_key", apiKey)
  url.searchParams.set("method", method)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v.toString())
  }
  let allParams = Array.from(url.searchParams.entries())
  allParams = _sortBy(allParams, [0])
  const sig = allParams.reduce((acc, [k, v]) => acc + k + v, "") + secret
  const hash = SparkMD5.hash(sig)
  url.searchParams.set("api_sig", hash)

  url.searchParams.set("format", "json")

  return url.href
}

export async function GET(method, params) {
  const href = constructUrl(method, params)
  const re = await fetch(href, {
    headers: { Accept: "application/json" },
  })
  const obj = await re.json()
  if (obj.error) {
    throw new LfmError(obj)
  }
  return obj
}

export async function authGetToken() {
  const obj = await GET("auth.gettoken", {})
  return obj.token
}

export async function authGetSession(token) {
  const obj = await GET("auth.getsession", { token })
  return obj.session
}

export async function userGetInfo(username) {
  const { user } = await GET("user.getinfo", { user: username })
  const avatarHref = user.image[0]["#text"]
  return { name: user.name, avatarHref: avatarHref || null, "#raw": user }
}

export async function userExists(username: string) {
  const href = constructUrl("user.getinfo", { user: username })
  const re = await fetch(href, {
    method: "HEAD",
    headers: { Accept: "application/json" },
  })
  return re.status === 200
}
