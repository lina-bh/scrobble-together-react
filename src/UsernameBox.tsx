import { useRef } from "react"
import FormControl from "react-bootstrap/FormControl"
import InputGroup from "react-bootstrap/InputGroup"
import Button from "react-bootstrap/Button"

interface UsernameBoxProps {
  onSubmit: (username: string) => void
}

const UsernameBox = ({ onSubmit }: UsernameBoxProps) => {
  const input = useRef<HTMLInputElement>(null)

  const enter = () => {
    if (input.current) onSubmit(input.current.value)
  }

  return (
    <InputGroup className="mx-auto">
      <FormControl
        type="text"
        placeholder="Last.fm username"
        ref={input}
        onKeyPress={(ev) => {
          if (ev.key === "Enter") {
            enter()
          }
        }}
      />
      <Button onClick={enter}>Start</Button>
    </InputGroup>
  )
}

export default UsernameBox
