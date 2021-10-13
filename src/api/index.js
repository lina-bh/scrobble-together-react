import SparkMD5 from "spark-md5";
import globalConfig from "./config";

export class LfmError extends Error {
  constructor(o) {
    super(`${o.message}`);
    this.code = o.error;
    this.name = this.constructor.name;
  }
}

const constructUrl = (config, method, params) => {
  const { apiKey, secret } = config;
  const base = config.base || "https://ws.audioscrobbler.com/2.0/";

  const url = new URL(base);

  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("method", method);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const allParams = Array.from(url.searchParams.entries());
  allParams.sort((a, b) => {
    const k1 = a[0];
    const k2 = b[0];
    if (k1 > k2) return 1;
    if (k2 > k1) return -1;
    return 0;
  });
  const sig = allParams.reduce((acc, [k, v]) => acc + k + v, "") + secret;
  const hash = SparkMD5.hash(sig);
  url.searchParams.set("api_sig", hash);

  url.searchParams.set("format", "json");

  return url;
};

export async function GET(method, params, config) {
  config = config || globalConfig;
  const url = constructUrl(config, method, params);
  const resp = await fetch(url.href, {
    headers: { Accept: "application/json" },
  });
  const body = await resp.json();
  if (body.error) {
    throw new LfmError(body);
  }
  return body;
}

export async function authGetToken(config) {
  const b = await GET("auth.gettoken", {}, config);
  return b.token;
}

export async function authGetSession(token, config) {
  const b = await GET("auth.getsession", { token }, config);
  return b.session;
}

export async function userGetInfo(user) {
  const b = await GET("user.getinfo", { user });
  return { name: b.user.name, "#raw": b };
}

function mapTrack(tr) {
  let o = {
    artist: tr.artist["#text"],
    album: tr.album["#text"],
    name: tr.name,
    mbid: tr.mbid,
  };
  if (!(tr["@attr"] && tr["@attr"].nowplaying)) {
    o.time = new Date(parseInt(tr.date.uts, 10) * 1000);
  }
  return o;
}

export async function userGetRecentTracks(user, params) {
  const b = await GET("user.getrecenttracks", { user, ...params });
  const { recenttracks } = b;
  let tracks = recenttracks.track;
  if (!Array.isArray(tracks)) {
    tracks = [tracks];
  }
  let nowPlaying = null;
  if (tracks.length >= 1 && tracks[0]["@attr"]?.nowplaying) {
    nowPlaying = mapTrack(tracks.shift());
  }
  return {
    nowPlaying,
    tracks: tracks.map(mapTrack),
    "#raw": b,
  };
}
