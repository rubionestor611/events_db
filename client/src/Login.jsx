import React, {useState} from 'react';

export const Login = (props) =>{
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit =() =>{

  }

  return (
    <div className='auth-form-container'>
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label for="username">username</label>
        <input value={username} type="text" placeholder="username" id="username" name="username"/>
        <label for="password">password</label>
        <input value={password} type="password" placeholder="*****" id="password" name="password"/>
        <button type="submit">Login</button>
      </form>
      <div className="register-btn-container">
        <button className='link-btn' onClick={()=>props.onFormSwitch("register")}>Don't have an account? Register here!</button>
        <button className='link-btn' onClick={()=>props.onFormSwitch("register-admin")}>Know the admin secret? Register here!</button>
      </div>
    </div>
  )
}