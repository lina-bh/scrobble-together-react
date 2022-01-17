import React, { useState, useEffect, useRef } from "react"
import { fromUnixTime } from "date-fns/esm"

import { GET } from "./api"

const Follower = ({ target }) => {
  const timer = useRef<number | null>(null)

  const [tracks, setTracks] = useState(() => [] as any[])

  useEffect(() => {
    const INTERVAL = 2 * 60 * 1000

    const tick = async () => {
      console.log("tick ", new Date())
      const {
        recenttracks: { track },
      } = await GET("user.getrecenttracks", {
        user: target.name,
        limit: 10,
      })
      track.forEach((rec) => {
        delete rec.streamable
        rec.album = rec.album["#text"]
        rec.artist = rec.artist["#text"]
        rec.date = fromUnixTime(parseInt(rec.date.uts, 10))
      })
      console.log(track)
      setTracks(track)
      timer.current = window.setTimeout(tick, INTERVAL)
    }
    if (!timer.current) {
      tick()
    }
    return () => {
      if (timer.current) {
        window.clearTimeout(timer.current)
      }
    }
  }, [target.name])

  return (
    <ol>
      {tracks.map((t) => (
        <li key={t.date.getTime()}>
          {t.artist} - {t.album} - {t.name} - {t.date.toString()}
        </li>
      ))}
    </ol>
  )
}

export default Follower
