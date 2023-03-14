import React, {useEffect, useState} from 'react';
import axios from 'axios';

export const Register = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState({});
  const [uniList, setUniList] = useState([]);

  useEffect(()=>{
    axios.get('http://localhost:8800/universities/').then((res) =>setUniList(res))
  }, []);

  const handleSubmit =(e) =>{
    e.preventDefault();
    console.log()
  }

  return (
    <div className='auth-form-container'>
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="username">username</label>
        <input onChange={e=>setUsername(e.target.value)} value={username} type="text" placeholder="username" id="username" name="username"/>
        <label htmlFor="password">password</label>
        <input onChange={e=>setPassword(e.target.value)} value={password} type="password" placeholder="*****" id="password" name="password"/>
        <label htmlFor="university">University</label>
        <select name="selectedUni">
          <option value="" >Select a University</option>
          {
            uniList.map((uni) =>{
              <option onSelect={setUniversity({id: uni.id, name: uni.name})} value={uni.id}>{uni.name}</option>
            })
          }
        </select>
        <button type="submit">Login</button>
      </form>
      <button className='link-btn' onClick={()=>props.onFormSwitch("login")}>Already have an account? Register here!</button>
    </div>
  )
}