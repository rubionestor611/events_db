import React, {useState} from 'react';


export const RegisterAdmin = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminGuess, setAdminGuess] = useState('');

  const handleSubmit =() =>{

  }

  return (
    <div className='auth-form-container'>
      <h2>Super Admin Register</h2>
      <form className="register-admin-form" onSubmit={handleSubmit}>
        <label for="admin-guess">Admin Key</label>
        <input value={adminGuess} type="text" placeholder="Admin Key" id="admin-guess" name="admin-guess"/>
        <label for="username">username</label>
        <input value={username} type="text" placeholder="username" id="username" name="username"/>
        <label for="password">password</label>
        <input value={password} type="password" placeholder="*****" id="password" name="password"/>
        <button type="submit">Login</button>
      </form>
      <button className='link-btn' onClick={()=>props.onFormSwitch("login")}>Already have an account? Register here!</button>
    </div>
  )
}