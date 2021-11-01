import { useState, useEffect, useRef } from "react"
import {
  getUnixTime,
  addSeconds,
  format as formatDate,
  compareDesc,
  formatDistanceToNow,
} from "date-fns"
import { OrderedMap as ImOrderedMap } from "immutable"
import Button from "react-bootstrap/Button"

// import "./ScrobsView.css"
import { userGetRecentTracks, Scrob } from "./userGetRecentTracks"
import Avatar from "./Avatar"

function scrobToListItem(scrob, key = null) {
  return (
    <li key={key}>
      {scrob.artist}
      <br />
      {scrob.album}
      <br />
      {scrob.name}
      <br />
      {scrob.time
        ? `${formatDistanceToNow(scrob.time)} ago`
        : " is currently playing"}
    </li>
  )
}

export default function ScrobsView({ onClear, user }) {
  const since = useRef(new Date(0))
  const timer = useRef(null)

  const [nowPlaying, setNowPlaying] = useState(null)
  const [scrobs, setScrobs] = useState(ImOrderedMap<string, Scrob>())

  useEffect(() => {
    const tick = async () => {
      console.log("tick " + formatDate(new Date(), "HH:mm"))
      const recent = await userGetRecentTracks(user.name, {
        limit: 10,
        from: getUnixTime(since.current),
      })
      console.log(recent)
      const newScrobs = recent.tracks.sort((l, r) =>
        compareDesc(l.time, r.time)
      )
      since.current = newScrobs?.[0]
        ? addSeconds(newScrobs[0].time, 1)
        : new Date()
      setNowPlaying(recent.nowPlaying ?? null)
      setScrobs((prevScrobs) => {
        let scrobs = prevScrobs.withMutations((map) => {
          for (const scrob of newScrobs) {
            map.set(scrob.toKey(), scrob)
          }
        })
        scrobs = scrobs.sortBy((scr) => scr.time, compareDesc)
        return scrobs
      })
      timer.current = setTimeout(tick, 60 * 1000)
    }
    if (!timer.current) {
      tick()
    }
    return () => {
      if (timer) {
        clearTimeout(timer.current)
      }
    }
  }, [user.name])

  return (
    <>
      <Avatar src={user.avatarHref} alt={`${user.name}'s avatar`} />
      {" " + user.name}
      <ul>
        {nowPlaying && scrobToListItem(nowPlaying)}
        {scrobs.toArray().map(([key, scrob]) => scrobToListItem(scrob, key))}
      </ul>
      <Button onClick={onClear}>Cease</Button>
    </>
  )
}
