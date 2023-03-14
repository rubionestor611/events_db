import React, {useState} from 'react';


export const RegisterAdmin = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminGuess, setAdminGuess] = useState('');

  const handleSubmit =(e) =>{
    e.preventDefault()
  }

  return (
    <div className='auth-form-container'>
      <h2>Super Admin Register</h2>
      <form className="register-admin-form" onSubmit={handleSubmit}>
        <label htmlFor="admin-guess">Admin Key</label>
        <input onChange={e=>setAdminGuess(e.target.value)} value={adminGuess} type="text" placeholder="Admin Key" id="admin-guess" name="admin-guess"/>
        <label htmlFor="username">username</label>
        <input onChange={e=>setUsername(e.target.value)} value={username} type="text" placeholder="username" id="username" name="username"/>
        <label htmlFor="password">password</label>
        <input onChange={e=>setPassword(e.target.value)} value={password} type="password" placeholder="*****" id="password" name="password"/>
        <button type="submit">Login</button>
      </form>
      <button className='link-btn' onClick={()=>props.onFormSwitch("login")}>Already have an account? Register here!</button>
    </div>
  )
}