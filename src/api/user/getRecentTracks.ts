import { fromUnixTime, getUnixTime } from "date-fns"

import { GET } from ".."

export class Scrob {
  artist: string
  album: string
  name: string
  mbid: string
  url: string
  _time: Date | null

  constructor(tr: any) {
    this.artist = tr.artist["#text"]
    this.album = tr.album["#text"]
    this.name = tr.name
    this.mbid = tr.mbid
    this._time = tr["@attr"]?.nowplaying
      ? null
      : fromUnixTime(parseInt(tr.date.uts, 10))
    this.url = tr.url
  }

  toKey() {
    let time
    if (this._time) {
      time = getUnixTime(this._time)
    } else {
      time = "nowplaying"
    }
    return this.artist + "-" + this.name + "-" + time
  }

  get time() {
    return this._time ?? new Date()
  }

  get nowPlaying() {
    return this._time == null
  }
}

interface RecentTracks {
  nowPlaying: Scrob | null
  tracks: [Scrob]
  "#raw": any
}

interface UserGetRecentTracksParams {
  user: string
  limit?: number
  from?: number
}

export async function userGetRecentTracks(
  params: UserGetRecentTracksParams
): Promise<RecentTracks> {
  const b = await GET("user.getrecenttracks", params)
  const { recenttracks } = b
  let tracks = recenttracks.track
  if (!Array.isArray(tracks)) {
    tracks = [tracks]
  }
  const nowPlaying = tracks?.[0]?.["@attr"]?.nowplaying
    ? new Scrob(tracks.shift())
    : null
  return {
    nowPlaying,
    tracks: tracks.map((t: any) => new Scrob(t)),
    "#raw": b,
  }
}
