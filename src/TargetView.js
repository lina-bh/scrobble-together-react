import { formatDistanceToNow } from "date-fns"
import ListGroup from "react-bootstrap/ListGroup"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"

import Avatar from "./Avatar"

const ScrobItem = ({ scrob }) => (
  <ListGroup.Item>
    <Row>
      <Col className="text-truncate">
        <b>
          <a target="_blank" rel="noreferrer" href={scrob.url}>
            {scrob.name}
          </a>
        </b>
      </Col>
    </Row>
    <Row>
      <Col sm={5} className="text-truncate">
        {scrob.artist}
      </Col>
      <Col className="text-end">
        {scrob.nowPlaying ? "now" : `${formatDistanceToNow(scrob.time)} ago`}
      </Col>
    </Row>
  </ListGroup.Item>
)

const TargetView = ({ user, nowPlaying, onClear, ...props }) => {
  const scrobs = props.children
  return (
    <>
      <div className="mx-auto">
        <Avatar
          className="me-2"
          src={user.avatarHref}
          alt={`${user.name}'s avatar`}
        />
        {user.name}
        <Button className="float-end" onClick={onClear}>
          Cease
        </Button>
      </div>
      <ListGroup className="my-3 mx-auto">
        {nowPlaying && <ScrobItem scrob={nowPlaying} />}
        {scrobs.map(([key, scr]) => (
          <ScrobItem scrob={scr} key={key} />
        ))}
      </ListGroup>
    </>
  )
}
/*
<>
      <Avatar src={target.avatarHref} alt={`${target.name}'s avatar`} />
      {target.name}
      <ul>
        {nowPlaying && <ScrobItem scrob={nowPlaying} />}
        {scrobs.map(([key, scr]) => (
          <ScrobItem scrob={scr} />
        ))}
      </ul>
      <Button onClick={onClear}>Cease</Button>
    </>
    */
export default TargetView
