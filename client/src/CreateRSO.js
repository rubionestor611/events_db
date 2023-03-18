import React, {useState} from 'react';
import { useGlobalState } from './GlobalState';
import axios from 'axios';

const CreateRSO = () => {
  const [RSOName, setRSOName] = useState('');
  const [globalState, updateGlobalState] = useGlobalState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!globalState.user){
      alert("You don't have permission!");
      return;
    }

    if(RSOName == ''){
      alert(' Provide a name for the RSO you wish to create');
      return;
    }

    // axios call - handle storing a member of that rso name. if 4 of them then approve the rso and make this one admin
    axios.post('http://localhost:8800/rsos/create',
    {
      name: RSOName,
      approved: 0,
      uni_id: globalState.user.uni_id,
      user_id: globalState.user.id
    }).then((response)=>{
      console.log(response);
      alert(`${RSOName} has been created!`);
    }).catch(err=>{
      console.log(err);
      alert(`Failed to create the RSO named ${RSOName}`)
    })
  }

  return (
    <div className='create-uni-form-container'>
      <h2>Create RSO</h2>
      <form className='create-rso' onSubmit={handleSubmit}>
        <label htmlFor="rsoname">University Name</label>
        <input onChange={e=>setRSOName(e.target.value)} value={RSOName} type="text" placeholder="RSO" id="rsoname" name="rsoname"/>
        <button type="submit">Create RSO</button>
      </form>
    </div>
  );
};
  
export default CreateRSO;