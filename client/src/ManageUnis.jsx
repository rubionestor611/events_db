import React, {useState, useEffect} from 'react';
import axios from 'axios';  



const ManageUnis = () => {
  const[uniList, setUniList] = useState([]);

  useEffect(() => {
    async function getUnis() {
      const res = await axios.get('http://localhost:8800/universities/');
      const universityList = await res.data.universities;
      setUniList(universityList);
    }
    getUnis();
  }, []);

  function deleteUni(id) {
    console.log('in delete id is ', id)
    axios.post(`http://localhost:8800/universities/delete/${id}`)
      .then((response)=>{
        console.log("universities", response.data.universities)
        setUniList(response.data.universities);
      })
      .catch(err => {
        console.log(err)
      });
  }

  return (
    <div>
      <ul className='manage-uni-list'>
      {
        uniList.length > 0 ? uniList.map(item=>
          <li key={item.id} value={item.id}>
            {<div className='manage-uni-card'>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <button type="button" value={item.id} className='manage-uni-delete' onClick={(e) => deleteUni(e.target.value)}>Delete</button>
          </div>}
          </li>
          ) : <li><h1>No Universities to see ... try making some!</h1></li>
      }
      </ul>
    </div>
  );
};
  
export default ManageUnis;