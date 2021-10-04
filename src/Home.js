import { createRef, useState } from "react";
import { useAuth } from "./AuthContext";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { debounce } from "lodash";

const TrackBox = (props) => {
  const inputRef = createRef();
  const onClick = debounce(() => {
    props.submit(inputRef.current.value);
  }, 100);
  return (
    <>
      <InputGroup className="mx-auto px-5">
        <FormControl
          type="text"
          placeholder="Last.fm username"
          ref={inputRef}
        />
        <Button onClick={onClick}>Start</Button>
      </InputGroup>
    </>
  );
};

const Home = () => {
  const auth = useAuth();
  const [trackedUser, setTrackedUser] = useState(null);
  const submit = (name) => {
    setTrackedUser(name);
  };
  return (
    <>
      {trackedUser ? (
        <>
          <p>{`tracking ${trackedUser}`}</p>
          <a href="#">stop!</a>
        </>
      ) : (
        <>
          <p>
            Enter someone's Last.fm username and Scrobble Together will start
            tracking their scrobbles.
          </p>
          <TrackBox submit={submit} />
        </>
      )}
    </>
  );
};

export default Home;
