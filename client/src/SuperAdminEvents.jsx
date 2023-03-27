import React, {useState, useEffect} from 'react';
import axios from 'axios';  
import {useGlobalState} from './GlobalState';



const SuperAdminEvents = () => {
  const [eventList, setEventList] = useState([]);
  const [globalState, updateGlobalState] = useGlobalState();

  async function getEvents() {
    const res = await axios.get(`http://localhost:8800/events/superadmin/${globalState.user.id}/getUnapprovedEvents`);
    const events = await res.data.events;
    setEventList(events);
  }

  useEffect(() => {
    getEvents();
  }, []);

  function approveEvent(id){
    axios.post('http://localhost:8800/events/superadmin/approveEvent',
    {
      id: id
    }).then(result=>{
      alert('Event Approved!');
      getEvents();
    }).catch(err => {
      alert('Something went wrong declining this event');
    })
  }

  function denyEvent(id){
    axios.post('http://localhost:8800/events/superadmin/denyEvent',
    {
      id: id
    }).then(result=>{
      alert('Event Denied!');
      getEvents();
    }).catch(err => {
      alert('Something went wrong denying this event');
    })
  }

  return (
    <div>
      <ul className='sa-event-list'>
      {
        eventList.length > 0 ? eventList.map(item=>
          <li key={item.id} value={item.id}>
            {<div className='manage-uni-card'>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <p>{item.category}</p>
            <p>{item.time} {item.date}</p>
            <p>{item.location}</p>
            <div className="sa-event-btn-container">
              <button type="button" value={item.id} className='sa-event-approve' onClick={(e) => approveEvent(e.target.value)}>Approve</button>
              <button type="button" value={item.id} className='sa-event-decline' onClick={(e) => denyEvent(e.target.value)}>Decline</button>
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