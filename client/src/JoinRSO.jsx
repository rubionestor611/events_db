import React, {useState, useEffect} from 'react';
import { useGlobalState } from './GlobalState';
import axios from 'axios';

const JoinRSO = () => {
  const [RSO, setRSO] = useState(-1);
  const [RSOs, setRSOs] = useState([]);
  const [globalState, updateGlobalState] = useGlobalState();

  useEffect(() => {
    async function getRSOs() {
      const res = await axios.get(`http://localhost:8800/rsos/${globalState.user.uni_id}/`);
      const rsos = await res.data.rsos;
      setRSOs(rsos);
    }
    getRSOs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!globalState.user){
      alert("You don't have permission!");
      return;
    }

    if(RSO == -1){
      alert(' Provide a name for the RSO you wish to create');
      return;
    }

    // axios call - handle storing a member of that rso name. if 4 of them then approve the rso and make this one admin
    console.log('should join rso', RSO);
  }

  return (
    <div>
      <h2>Join an RSO!</h2>
    <div className='auth-form-container'>
      <select style={{marginBottom: '1rem', display: 'block'}} onChange={(e)=>{
          setRSO(e.target.value);
          }} name="selectedUni">
          <option value={-1} >Select an RSO</option>
          {
            RSOs.map(rso => <option key={rso.id} value={rso.id}>{rso.name}</option>)
          }
      </select>
      <button type="submit" value={RSO} onClick={(e) => handleSubmit(e)}>Join RSO</button>
    </div>
    </div>
  );
};
  
export default JoinRSO;