import { Component } from "react";
import { userGetRecentTracks } from "./api";
import { compareAsc, fromUnixTime, getUnixTime, addSeconds } from "date-fns";
import { Map, OrderedMap, List } from "immutable";

const INTERVAL = 60 * 1000;

export default class Tracker extends Component {
  constructor(props) {
    super(props);
    this.username = this.props.user.name;
    this.state = {
      tracks: new List(),
      nowPlaying: null,
      since: 0,
      paused: sessionStorage.getItem("paused") === "true" || false,
    };
  }

  componentDidMount() {
    this.tid = setInterval(() => this.tick(), INTERVAL);
    this.tick();
  }

  componentWillUnmount() {
    clearInterval(this.tid);
  }

  togglePaused() {
    const paused = !this.state.paused;
    this.setState({ paused });
    sessionStorage.setItem("paused", paused);
  }

  tick = () => {
    console.log("tick from Tracker " + Date());
    if (this.state.paused) {
      return;
    }

    (async () => {
      let { since } = this.state;
      const recent = await userGetRecentTracks(this.username, {
        limit: since ? 10 : 1,
        from: getUnixTime(since),
      });
      console.log(recent);
      let tracks = new List(recent.tracks);
      tracks = tracks.sort((l, r) => compareAsc(l.time, r.time));
      if (tracks.size > 0) {
        since = addSeconds(tracks.get(0).time, 1);
      }
      this.setState((state) => {
        return {
          nowPlaying: recent.nowPlaying,
          tracks: state.tracks.concat(tracks),
          since,
        };
      });
    })();
  };

  render() {
    const { onClear } = this.props;
    const { nowPlaying } = this.state;
    const tracks = Array.from(this.state.tracks.values());
    return (
      <>
        <p>tracking {this.username}</p>
        {nowPlaying && <p>now playing: {JSON.stringify(nowPlaying)}</p>}
        <ul>
          {tracks.map((track, idx) => (
            <li key={idx}>
              {track.artist} - {track.album} - {track.name}
              {track.time && `, ${track.time.toString()}`}
            </li>
          ))}
        </ul>
        <button onClick={onClear}>stop!</button>
      </>
    );
  }
}
