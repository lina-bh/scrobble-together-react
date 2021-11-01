import { fromUnixTime, getUnixTime } from "date-fns"

import { GET } from "./api"

export interface NowPlaying {
  artist: string
  album: string
  name: string
  mbid: string
  toKey: () => string
}

export interface Scrob extends NowPlaying {
  time: Date
}

const scrobProto = {
  toKey() {
    return this.artist + "-" + this.name + "-" + getUnixTime(this.time)
  },
}

function scrobFromTrack(tr): Scrob {
  let sc: Scrob = Object.assign(Object.create(scrobProto), {
    artist: tr.artist["#text"],
    album: tr.album["#text"],
    name: tr.name,
    mbid: tr.mbid,
  })
  if (!tr["@attr"]?.nowplaying) {
    sc.time = fromUnixTime(parseInt(tr.date.uts, 10))
  }
  return sc
}

interface RecentTracks {
  nowPlaying: NowPlaying
  tracks: [Scrob]
  "#raw": any
}

export async function userGetRecentTracks(
  username,
  params
): Promise<RecentTracks> {
  const b = await GET("user.getrecenttracks", { user: username, ...params })
  const { recenttracks } = b
  let tracks = recenttracks.track
  if (!Array.isArray(tracks)) {
    tracks = [tracks]
  }
  const nowPlaying = tracks?.[0]?.["@attr"]?.nowplaying
    ? scrobFromTrack(tracks.shift())
    : null
  return {
    nowPlaying,
    tracks: tracks.map(scrobFromTrack),
    "#raw": b,
  }
}
