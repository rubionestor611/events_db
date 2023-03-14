import React, {useState} from 'react';

export const Login = (props) =>{
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit =(e) =>{
    e.preventDefault()
    console.log(username, password)
  }

  return (
    <div className='auth-form-container'>
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