import React, {useState} from 'react';
import { useNavigate} from 'react-router-dom';


export const RegisterAdmin = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminGuess, setAdminGuess] = useState('');
  const navigate = useNavigate();

  const handleSubmit =(e) =>{
    e.preventDefault();
    navigate('landing')
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
        <button type="submit">Register</button>
      </form>
      <button className='link-btn' onClick={()=>props.onFormSwitch("login")}>Already have an account? Log in here!</button>
    </div>
  )
}