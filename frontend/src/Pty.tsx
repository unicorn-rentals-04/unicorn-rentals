import {useCallback, useState} from "react";
import {useRecoilState} from "recoil";
import {BuildAppUrl} from ".";
import {authToken} from "./App";
import './Pty.css';

interface CommandData {
  useShell: boolean;
  command: string[];
}

export function Pty() {
  const [token] = useRecoilState(authToken)
  const [command, setcommand] = useState<CommandData>({useShell: false, command: []})
  const [data, setdata] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [submittedCommand, setSubmitCommand] = useState<string[]>([])
  const [useShell, setUseShell] = useState<boolean>(false)
  
  const handleChange = (event: any) => {
    const value = event.target.value.trim();
    const input = value.split(" ")
    setcommand({
      useShell,
      command: input,
    });
  };

  const handleShellBool = () => {
    const value = !useShell
    setUseShell(value)
    command.useShell = value
    setcommand({
      command: command.command,
      useShell: value,
    })
  }

  const sendRequest = useCallback(async () => {
    if (isSending) return
    setdata("")
    setIsSending(true)
    setSubmitCommand(command.command)
    let res: Response
    try {
      res = await fetch(BuildAppUrl("/api/pty"), {
        method: "POST",
        body: JSON.stringify(command),
        headers: {
          "X-Auth-Token": token.toString(),
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      })
    } catch (error) {
      console.log('There was an error', error);
      setdata(error as any)
      return
    }

    if (res.status !== 200) {
      console.log(JSON.stringify(res))
      setdata(res.statusText)
      return
    }

    const data = await res.text()
    if (data) {
      setdata(JSON.parse(data)?.response)
    }
    setIsSending(false)
  }, [isSending, command, token]) // update the callback if the state changes


  return <div className="pty">
    <hr />
    <div className="terminal">
      <div>
        <span>Use shell?</span>
        <input checked={useShell} type="checkbox" onChange={handleShellBool} />
        <br />
        <input onChange={handleChange} id="input"></input><br />
        <button onClick={sendRequest}>Run</button>
      </div>
      {data &&
        <div>
          <br />
          <h2>{submittedCommand.map((cc, idx) => <span key={`cmd+${idx}`}>{cc} </span>)}</h2>
          <pre>{data.split("\n").map((q, idx) => <div key={`res+${idx}`}>{q}<br /></div>)}</pre>
        </div> }
    </div>
  </div>
}
