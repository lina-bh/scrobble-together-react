import SparkMD5 from "spark-md5"
import MD5 from "crypto-js/md5"

const apiKey = "f28fccb10bd142b6dc8eadded052dbb5"
const secret = "20a39b774e2403f30755568fff0273c5"
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

function constructUrl(method: string, params: Record<string, any>) {
  const url = new URL("https://ws.audioscrobbler.com/2.0/")

  url.searchParams.set("api_key", apiKey)
  url.searchParams.set("method", method)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v.toString())
  }
  let allParams = Array.from(url.searchParams.entries())
  allParams.sort((a, b) => (a[0] > b[0] ? 1 : b[0] > a[0] ? -1 : 0))
  const sig = allParams.reduce((acc, [k, v]) => acc + k + v, "") + secret
  const hash = MD5(sig).toString()
  url.searchParams.set("api_sig", hash)

  url.searchParams.set("format", "json")

  return url.href
}

export async function GET(method: string, params: Record<string, any>) {
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

export async function authGetSession(token: string) {
  const obj = await GET("auth.getsession", { token })
  return obj.session
}

export async function userExists(username: string) {
  const href = constructUrl("user.getinfo", { user: username })
  const re = await fetch(href, {
    method: "HEAD",
    headers: { Accept: "application/json" },
  })
  return re.status === 200
}
