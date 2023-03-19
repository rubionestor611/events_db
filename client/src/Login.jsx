import React, {useState} from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { useGlobalState } from "./GlobalState.js";

export const Login = (props) =>{
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [globalState, updateGlobalState] = useGlobalState();

  const handleSubmit = async(e) =>{
    e.preventDefault()
    // check to make sure info is valid
    axios.post("http://localhost:8800/authenticate/login", {
      username,password
    }).then((response) => {
      // have user info
      if(response.data.success){
        // set user info in globalstate
        updateGlobalState("user", response.data.user);

        navigate('/landing');
      }
    }).catch((error)=>{
      alert(error.response.data.msg)
    });
  }

  return (
    <div className='auth-form-container' style={{border:"none"}}>
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="username">username</label>
        <input onChange={e=>setUsername(e.target.value)} value={username} type="text" placeholder="username" id="username" name="username"/>
        <label htmlFor="password">password</label>
        <input onChange={e=>setPassword(e.target.value)} value={password} type="password" placeholder="*****" id="password" name="password"/>
        <button type="submit">Login</button>
      </form>
      <div className="register-btn-container">
        <button className='link-btn' onClick={()=>props.onFormSwitch("register")}>Don't have an account? Register here!</button>
        <button className='link-btn' onClick={()=>props.onFormSwitch("register-admin")}>Know the admin secret? Register here!</button>
      </div>
    </div>
  )
}