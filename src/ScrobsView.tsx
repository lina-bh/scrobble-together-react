import { useState, useEffect, useRef } from "react"
import {
  getUnixTime,
  addSeconds,
  format as formatDate,
  compareDesc,
  formatDistanceToNow,
} from "date-fns"
import produce from "immer"
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
  const [scrobs, setScrobs] = useState(() => new Map<string, Scrob>())

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
      setScrobs(
        produce((draft) => {
          for (const scrob of newScrobs) {
            draft.set(scrob.toKey(), scrob)
          }
          // draft = scrobs.sortBy((scr) => scr.time, compareDesc)
        })
      )
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

  const scrobItems = [...scrobs.entries()]
    .sort(([_, l], [__, r]) => compareDesc(l.time, r.time))
    .map(([key, scrob]) => scrobToListItem(scrob, key))

  return (
    <>
      <Avatar src={user.avatarHref} alt={`${user.name}'s avatar`} />
      {user.name}
      <ul>
        {nowPlaying && scrobToListItem(nowPlaying)}
        {scrobItems}
      </ul>
      <Button onClick={onClear}>Cease</Button>
    </>
  )
}
