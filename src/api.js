import SparkMD5 from "spark-md5"
import { fromUnixTime } from "date-fns"

const apiKey = process.env.REACT_APP_LASTFM_KEY
const secret = process.env.REACT_APP_LASTFM_SECRET

export class LfmError extends Error {
  constructor(o) {
    super(`${o.message}`)
    this.code = o.error
    this.name = this.constructor.name
  }
}

function constructUrl(method, params) {
  const url = new URL("https://ws.audioscrobbler.com/2.0/")

  url.searchParams.set("api_key", apiKey)
  url.searchParams.set("method", method)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }

  const allParams = Array.from(url.searchParams.entries())
  allParams.sort((a, b) => {
    const k1 = a[0]
    const k2 = b[0]
    if (k1 > k2) return 1
    if (k2 > k1) return -1
    return 0
  })
  const sig = allParams.reduce((acc, [k, v]) => acc + k + v, "") + secret
  const hash = SparkMD5.hash(sig)
  url.searchParams.set("api_sig", hash)

  url.searchParams.set("format", "json")

  return url
}

export async function GET(method, params) {
  const url = constructUrl(method, params)
  const resp = await fetch(url.href, {
    headers: { Accept: "application/json" },
  })
  const body = await resp.json()
  if (body.error) {
    throw new LfmError(body)
  }
  return body
}

export async function authGetToken() {
  const b = await GET("auth.gettoken", {})
  return b.token
}

export async function authGetSession(token) {
  const b = await GET("auth.getsession", { token })
  return b.session
}

export async function userGetInfo(user) {
  const b = await GET("user.getinfo", { user })
  return { name: b.user.name, "#raw": b }
}

function mapTrack(tr) {
  let o = {
    artist: tr.artist["#text"],
    album: tr.album["#text"],
    name: tr.name,
    mbid: tr.mbid,
  }
  if (!tr["@attr"]?.nowplaying) {
    o.time = fromUnixTime(parseInt(tr.date.uts, 10))
  }
  return o
}

export async function userGetRecentTracks(username, params) {
  const b = await GET("user.getrecenttracks", { user: username, ...params })
  const { recenttracks } = b
  let tracks = recenttracks.track
  if (!Array.isArray(tracks)) {
    tracks = [tracks]
  }
  let nowPlaying = null
  if (tracks?.[0]?.["@attr"]?.nowplaying) {
    nowPlaying = mapTrack(tracks.shift())
  }
  return {
    nowPlaying,
    tracks: tracks.map(mapTrack),
    "#raw": b,
  }
}
