import {useRecoilState} from "recoil";
import { authToken, loggedIn } from "./App";
import "./Login.css";

export function Login() {
  const [token, setAuthToken] = useRecoilState(authToken);
  const [isLoggedIn, setLoggedIn] = useRecoilState(loggedIn)

  const handleChange = (event: any) => {
    const value = event.target.value.trim();
    setAuthToken(value);
  };

  const setPassword = () => setLoggedIn(true)
  const logout = () => {
    setAuthToken("")
    setLoggedIn(false)
  }

  if (isLoggedIn) {
    return <div className="login">
      <hr />
      <h3>logged in.</h3>
      <button onClick={logout}>Logout</button>
    </div>
  } else {
    return <div className="login">
      <hr />
      <span>Enter Auth Token</span><br />
      <input type="password" id="password" onChange={handleChange} /><br />
      <button onClick={setPassword} disabled={token.length === 0}>Submit</button>
    </div>
  }
}
