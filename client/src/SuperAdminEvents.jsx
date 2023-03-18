import React, {useState, useEffect} from 'react';
import axios from 'axios';  
import {useGlobalState} from './GlobalState';

const SuperAdminEvents = () => {
  const [eventList, setEventList] = useState([]);
  const [globalState, updateGlobalState] = useGlobalState();

  useEffect(() => {
    async function getEvents() {
      const res = await axios.get(`http://localhost:8800/events/superadmin/${globalState.user.id}/getUnapprovedEvents`);
      console.log(res.data.events)
      //const eventList = await res.data.events;
      //setEventList(universityList);
    }
    getEvents();
  }, []);

  return (
    <div>
      <ul className='sa-event-list'>
      {
        eventList.length > 0 ? eventList.map(item=>
          <li key={item.id} value={item.id}>
            {<div className='manage-uni-card'>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <div clasName="sa-event-btn-container">
              <button type="button" value={item.id} className='sa-event-approve' onClick={(e) => deleteUni(e.target.value)}>Approve</button>
              <button type="button" value={item.id} className='sa-event-decline' onClick={(e) => deleteUni(e.target.value)}>Decline</button>
            </div>
            
          </div>}
          </li>
          ) : <li><h1>No events to see ... looks like you're doing your job {globalState.user.username}!</h1></li>
      }
      </ul>
    </div>
  );
};
  
export default SuperAdminEvents;