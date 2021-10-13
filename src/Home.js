import React, { useState, useEffect } from "react";
// import { useAuth } from "./AuthContext";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { LfmError, userGetInfo } from "./api";
import Tracker from "./Tracker";

const TrackBox = (props) => {
  const { onSubmit } = props;

  const [username, setUsername] = useState(null);

  const onChange = (ev) => {
    setUsername(ev.target.value);
  };

  const doClick = () => {
    onSubmit(username);
  };

  return (
    <InputGroup className="mx-auto px-5">
      <FormControl
        type="text"
        placeholder="Last.fm username"
        onChange={onChange}
        onKeyPress={(ev) => {
          if (ev.key === "Enter") {
            doClick();
          }
        }}
      />
      <Button onClick={doClick}>Start</Button>
    </InputGroup>
  );
};

const Home = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [trackedUser, setTrackedUser] = useState(null);

  const doSubmit = async (username, auto) => {
    try {
      const user = await userGetInfo(username);
      console.log(user);
      setTrackedUser(user);
      sessionStorage.setItem("savedUser", user.name);
    } catch (ex) {
      if (ex instanceof LfmError && ex.code === 6) {
        if (auto) {
          sessionStorage.removeItem("savedUser");
        } else {
          setShowAlert(true);
        }
      } else {
        throw ex;
      }
    }
  };

  const clear = () => {
    sessionStorage.removeItem("savedUser");
    setTrackedUser(null);
  };

  useEffect(() => {
    let savedUser;
    if ((savedUser = sessionStorage.getItem("savedUser"))) {
      doSubmit(savedUser, true);
    }
  }, []);

  return trackedUser ? (
    <Tracker user={trackedUser} onClear={clear} />
  ) : (
    <>
      <p>
        Enter someone's Last.fm username and Scrobble Together will start
        tracking their scrobbles.
      </p>
      <TrackBox onSubmit={doSubmit} />
      {showAlert && (
        <Alert
          variant="danger"
          className="mt-3 mx-5"
          dismissible
          onClose={() => setShowAlert(false)}
        >
          User not found.
        </Alert>
      )}
    </>
  );
};

export default Home;
