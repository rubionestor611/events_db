import React, {useEffect, useState} from 'react';
import axios from 'axios';

export const Register = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [uniList, setUniList] = useState([]);

  useEffect(()=>{
    axios.get('http://localhost:8800/universities/').then((res) =>setUniList(res))
  }, []);

  const handleSubmit =() =>{

  }

  return (
    <div className='auth-form-container'>
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label for="username">username</label>
        <input value={username} type="text" placeholder="username" id="username" name="username"/>
        <label for="password">password</label>
        <input value={password} type="password" placeholder="*****" id="password" name="password"/>
        <label for="university">University</label>
        <select name="selectedUni">
          <option value="" >Select a University</option>
          {
            uniList.map((uni) =>{
              <option value={uni.id}>{uni.name}</option>
            })
          }
        </select>
        <button type="submit">Login</button>
      </form>
      <button className='link-btn' onClick={()=>props.onFormSwitch("login")}>Already have an account? Register here!</button>
    </div>
  )
}