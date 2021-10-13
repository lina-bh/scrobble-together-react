import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLastfm } from "@fortawesome/free-brands-svg-icons";
import Button from "react-bootstrap/Button";
import { authGetSession, authGetToken, LfmError } from "./api";
import { debounce } from "lodash";
import { AuthContext } from "./AuthContext";

const loginurl =
  "http://www.last.fm/api/auth/?api_key=f28fccb10bd142b6dc8eadded052dbb5";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      loginFn: false,
    };
    this.onFocus = debounce(this.onFocus.bind(this), 500);
  }

  async onFocus() {
    if (document.visibilityState === "hidden") {
      return;
    }
    const { loginFn, token } = this.state;
    if (loginFn && token) {
      try {
        const session = await authGetSession(token);
        loginFn(session);
      } catch (e) {
        if (!(e instanceof LfmError && e.code === 14)) {
          throw e;
        }
      }
    }
  }

  componentDidMount() {
    (async () => {
      this.setState({ token: await authGetToken() });
    })();
    window.addEventListener("visibilitychange", this.onFocus);
  }

  componentWillUnmount() {
    window.removeEventListener("visibilitychange", this.onFocus);
  }

  render() {
    return (
      <AuthContext.Consumer>
        {(auth) => (
          <div className="mb-2">
            <p>
              Scrobble Together listens for the scrobbles of another last.fm
              user and replicates them to your last.fm profile. Imagine you're
              in a music library or other kind of venue, or in the car listening
              together, and you want to add the songs you're both listening to
              on your last.fm: Scrobble Together is perfect for that. All you
              need to do is to log in with last.fm, and type in someone else's
              last.fm username.
            </p>
            <Button
              href={loginurl + "&token=" + this.state.token}
              target="_blank"
              onClick={() => this.setState({ loginFn: auth.login })}
            >
              <FontAwesomeIcon icon={faLastfm} /> Sign in with Last.fm
            </Button>
          </div>
        )}
      </AuthContext.Consumer>
    );
  }
}
