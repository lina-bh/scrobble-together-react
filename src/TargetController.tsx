import { useState, useEffect, useRef } from "react"
import { getUnixTime, addSeconds, compareDesc, lightFormat } from "date-fns"

import { userGetRecentTracks, Scrob } from "./api/user/getRecentTracks"
import { UserInfo } from "./api/user/getInfo"
import TargetView from "./TargetView"

interface TargetControllerProps {
  onClear: () => void
  target: UserInfo
}

export default function TargetController({
  onClear,
  target,
}: TargetControllerProps) {
  const since = useRef(new Date(0))
  const timer = useRef<number | null>(null)

  const [nowPlaying, setNowPlaying] = useState<Scrob | null>(null)
  const [scrobs, setScrobs] = useState<[string, Scrob][]>(() => [])

  useEffect(() => {
    const tick = async () => {
      console.log("tick " + lightFormat(new Date(), "HH:mm"))
      const recent = await userGetRecentTracks({
        user: target.name,
        limit: 3,
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
      setScrobs((prevState) =>
        newScrobs
          .map((scr) => [scr.toKey(), scr] as [string, Scrob])
          .concat(prevState)
      )
      timer.current = window.setTimeout(tick, 60 * 1000)
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
    <>
      <TargetView user={target} nowPlaying={nowPlaying} onClear={onClear}>
        {scrobs}
      </TargetView>
    </>
  )
}
