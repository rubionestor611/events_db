import React, {useState, useEffect} from 'react';
import { useGlobalState } from './GlobalState';
import axios from 'axios';

const RSOs = () => {
  const [RSO, setRSO] = useState(-1);
  const [RSOList, setRSOList] = useState([]);
  const [globalState, updateGlobalState] = useGlobalState();
  const [usersRSOs, setUsersRSOs] = useState([]);

  useEffect(() => {
    async function getRSOList() {
      const res = await axios.get(`http://localhost:8800/rsos/${globalState.user.uni_id}/`);
      const rsos = await res.data.rsos;
      setRSOList(rsos);
    }
    async function getUsersRSOs() {
      const res = await axios.get(`http://localhost:8800/rsos/${globalState.user.id}/in`);
      const rsos = await res.data.rsos;
      setUsersRSOs(rsos);
    }

    getRSOList();
    getUsersRSOs();
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
      async function getUsersRSOs() {
        const res = await axios.get(`http://localhost:8800/rsos/${globalState.user.id}/in`);
        const rsos = await res.data.rsos;
        setUsersRSOs(rsos);
      }
      getUsersRSOs();
    }).catch(err => {
      alert(err.response.data.msg)
    })
    
  }

  // removes user from RSO of id
  function deleteRSO(id) {
    axios.post(`http://localhost:8800/rsos/leave`,
    {
      user_id: globalState.user.id,
      rso_id: id
    }).then((response)=>{
        setUsersRSOs(response.data.rsos);
      })
      .catch(err => {
        console.log(err)
      });
  }

  return (
    <div style={{display:'flex',
      flexDirection: 'column'}}>
      <h2>Join an RSO at {globalState.user.uni_name}!</h2>
      <div className='auth-form-container' style={{marginBottom:'3rem'}}>
        <div>
          <select style={{marginBottom: '1rem'}} onChange={(e)=>{
              setRSO(e.target.value);
              }} name="selectedUni">
              <option value={-1} >Select an RSO</option>
              {
                RSOList.map(rso => <option key={rso.id} value={rso.id}>{rso.name}</option>)
              }
          </select>
        </div>
        <button type="submit" value={RSO} onClick={(e) => handleSubmit(e)}>Join RSO</button>
      </div>
      <h2>Leave an RSO</h2>
      <div>
        <ul className='manage-uni-list'>
        {
          usersRSOs.length > 0 ? usersRSOs.map(item=>
            <li key={item.id} value={item.id}>
              {<div className='manage-uni-card'>
              <h2>{item.name}</h2>
              <button type="button" value={item.id} className='manage-uni-delete' onClick={(e) => deleteRSO(e.target.value)}>Leave</button>
            </div>}
            </li>
            ) : <li><h1>No RSOs joined ... try joining one or even creating one!</h1></li>
        }
        </ul>
      </div>
    </div>
  );
};
  
export default RSOs;