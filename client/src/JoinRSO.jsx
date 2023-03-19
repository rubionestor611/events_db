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

    axios.post('http://localhost:8800/rsos/join',
    {
      user_id: globalState.user.id,
      rso_id: RSO
    }).then((res)=>{
      alert(`You've joined the rso!`)
    }).catch(err => {
      console.log(err)
      alert(err.response.data.msg)
    })
    
  }

  return (
    <div>
      <h2>Join an RSO at {globalState.user.uni_name}!</h2>
    <div className='auth-form-container'>
      <div>
        <select style={{marginBottom: '1rem'}} onChange={(e)=>{
            setRSO(e.target.value);
            }} name="selectedUni">
            <option value={-1} >Select an RSO</option>
            {
              RSOs.map(rso => <option key={rso.id} value={rso.id}>{rso.name}</option>)
            }
        </select>
      </div>
      <button type="submit" value={RSO} onClick={(e) => handleSubmit(e)}>Join RSO</button>
    </div>
    </div>
  );
};
  
export default JoinRSO;