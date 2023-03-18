import React, { useState } from 'react';
import axios from 'axios';
import { useGlobalState } from "./GlobalState.js";

const CreateUni = () => {

  const [uniName, setUniName] = useState('');
  const [uniDesc, setUniDesc] = useState('');
  const [uniLocation, setUniLocation] = useState('');
  const [globalState, updateGlobalState] = useGlobalState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!globalState.user || globalState.user.auth_level != 3){
      alert("You don't have permission!");
      return;
    }

    if(uniName == '' || uniDesc == ''){
      alert(' Provide a name and description for the university');
      return;
    }

    axios.post('http://localhost:8800/universities/create',
    {
      name: uniName,
      description: uniDesc,
      super_admin_id: globalState.user.id,
      location: uniLocation
    })
    .then((response)=>{
      alert(`${response.data.university.name} successfully created!`);
      setUniName('');
      setUniDesc('');
    })
    .catch(error => {
      alert(error)
    })
  }

  return (
    <div className='create-uni-form-container'>
      <h2>Create University</h2>
      <form className='create-uni' onSubmit={handleSubmit}>
        <label htmlFor="uniname">University Name</label>
        <input onChange={e=>setUniName(e.target.value)} value={uniName} type="text" placeholder="university" id="uniname" name="uniname"/>
        <label htmlFor="unidesc">Description</label>
        <input onChange={e=>setUniDesc(e.target.value)} value={uniDesc} type="text" placeholder="This university ..." id="unidesc" name="unidesc"/>
        <label htmlFor="unilocation">Description</label>
        <input onChange={e=>setUniLocation(e.target.value)} value={uniLocation} type="text" placeholder="City, State" id="unilocation" name="unilocation"/>
        <button type="submit">Create University</button>
      </form>
    </div>
  );
};
  
export default CreateUni;