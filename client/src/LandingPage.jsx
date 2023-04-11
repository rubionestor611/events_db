import './App.css';
import {useGlobalState} from "./GlobalState.js";
import {useState, useEffect} from 'react';
import axios from 'axios';  


const LandingPage = () => {
  const [globalState, updateGlobalState] = useGlobalState();
  const [publicEvents,setPublicEvents] = useState([]);
  const [privateEvents, setPrivateEvents] = useState([]);
  const [RSOEvents, setRSOEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [allComments, setAllComments] = useState([]);
  const [allRatings, setAllRatings] = useState([]);
  const [userComment, setUserComment] = useState('');
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    getPublicEvents();
    getPrivateEvents();
    getRSOEvents();
    getAllComments();
    getAllRatings();
  }, []);

  const EventInfo = ({ event , onClose, comments, ratings}) => {
    
    const eventComments = comments.filter((comment) => comment.event_id === event.id);
    const eventRatings = ratings.filter((rating) => rating.event_id === event.id);
    const [averageEventRating, setAverageEventRating] = useState(0);
    const [numEventRatings, setNumEventRatings] = useState(0);

    function addRating(rating)
    {
      numEventRatings += 1;
      averageEventRating = (averageEventRating + rating ) / numEventRatings;

    }
    return (
      <div className='event-info-modal'>
        <div className='event-info-content'>
          <button className='event-info-close' onClick={onClose}>X</button>
          <h2>Event Name: {event?.name}</h2>
          <p>Category: {event?.category}</p>
          <p>Description: {event?.description}</p>
          <p>Time: {event?.time}</p>
          <p>Date: {event?.date}</p>
          <p>Location ID: {event?.location_id}</p>
          <p>Location: {event?.location}</p>
          <p>Phone: {event?.phone}</p>
          <p>Email: {event?.email}</p>
          <p>Status: {event?.status}</p>
          <p>Uni ID: {event?.uni_id}</p>
          <p>RSO ID: {event?.rso_id}</p>
          <p>Admin ID: {event?.admin_id}</p>
          <div>
          <h3>Event Rating: {averageEventRating}</h3>

          <h3>Add Rating:</h3>
          <div>
            <select value={userRating} onChange={(e) => setUserRating(parseInt(e.target.value, 10))}>
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
          <button onClick={() => handleSubmitRating(event.id)}>Submit Rating</button>

          </div>
          <h3>Add Comment:             
          <div>
              <textarea value={userComment} onChange={(e) => setUserComment(e.target.value)}></textarea>
          </div></h3>
            <button onClick={() => handleSubmitComment(event.id)}>Submit Comment</button>
          </div>
          </div>
        <div>
            <h3>Comments:</h3>
            {
              eventComments.map((comment) => 
              (<p key={comment.id}>{comment.comment}</p>))
            }          
          </div>
          <div>
            
        </div>
        </div>
    );
  };

  const handleSubmitComment = async (eventID) => {
    await axios.post(`http://localhost:8800/comments/create`),
    {event_id: eventID,
    user_id: globalState.user.id,
    message: userComment}
    .then(console.log("User " + globalState.user.id, " says " + userComment))
    .catch(err=>{
      console.log("error " + err);
    })
    // Clear form inputs
    setUserComment('');
    // Refresh comments and ratings
    getAllComments();
  }
  
  const handleSubmitRating = async (eventID) => {

    await axios.post(`http://localhost:8800/ratings/create`),
    {
      event_id: eventID,
      user_id: globalState.user.id,
      rating: userRating
    }.then(console.log("User " + globalState.user.id, " rated " + userRating))
    .catch(err => {
      console.log("error: " + err);
    })
    // Clear form inputs
    setUserRating(0);

    // Refresh comments and ratings
    getAllRatings();
  }

  const getAllComments = async () => {
    axios.get(`http://localhost:8800/comments/all`)
      .then((response)=>{
        setAllComments(response.data);
        console.log("comments", response.data);
      })
      .catch(err=>{
        console.log("error:");
        console.log(err);       
      })
  }

  const getAllRatings = async () => {
    axios.get(`http://localhost:8800/ratings/all`)
      .then((response)=>{
        setAllRatings(response.data);
        console.log("ratings", response.data);
      })
      .catch(err=>{
        console.log("error:");
        console.log(err);       
      })
  }

  const getPublicEvents = async() => {
    axios.post(`http://localhost:8800/events/public`)
      .then((response)=>{
        setPublicEvents(response.data);
        console.log("public", response.data);
      })
      .catch(err=>{
        console.log("error:");
        console.log(err);       
      })
    }

  const getPrivateEvents = async() => {
    axios.post(`http://localhost:8800/events/private`, 
    {
      university_id: globalState.user.uni_id
    })
      .then((response)=>{
        setPrivateEvents(response.data);
        console.log("private", response.data)
      })
      .catch(err=>{
        console.log("error:");
        console.log(err);
      })
  }

  const getRSOEvents = async(RSO) => {
    axios.post(`http://localhost:8800/events/rso`,
    {
      idUser: globalState.user.id
    })
      .then((response)=>{
        console.log('rso', response.data)
        setRSOEvents(response.data);
      })
      .catch(err=>{
        console.log("error:");
        console.log(err);
      })
  }

  function openEvent(eventID){
    const allEvents = [...privateEvents, ...publicEvents, ...RSOEvents];
    const event = allEvents.find((e) => e.id === parseInt(eventID, 10));
    setSelectedEvent(event);
    // Set comments & ratings for event?
  }

  function closeEvent() {
    setSelectedEvent(null);
    // Undo set comment & rating
  }

  return(
    <div>
    
      <div style={{position: 'absolute',top: "5%", left: "50%"}}>
        <p style={{fontWeight: 'bold'}}>Welcome {globalState.user.username}!</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20 }}>
        <div><h1 style={{position: 'absolute', top: "10%", left: '5%'}}>Private Events</h1>
          <ul className='manage-private-events-list'>
            {
              privateEvents.length > 0 ? privateEvents.map(item=>
                <li key={item.id} value={item.id}>
                  {<div className='manage-event-card'>
                  <h2>Event: {item.name}</h2>
                  <p>{item.description}</p>
                  <p>{item.location}</p>
                  <button type="button" value={item.id} className='manage-event-open'
                  onClick={(e) => openEvent(e.target.value)}>Event Info</button>
                </div>}
                </li>
                ) : <li><h1>No Private Events to see ... try making some!</h1></li>
            }
          </ul>
        </div>
        <div><h1 style={{position: 'absolute', top: "10%", right: "40%"}}>Public Events</h1>
          <ul className='manage-public-events-list'>
            {
              publicEvents.length > 0 ? publicEvents.map(item=>
                <li key={item.id} value={item.id}>
                  {<div className='manage-event-card'>
                  <h2>Event: {item.name}</h2>
                  <p>{item.description}</p>
                  <p>{item.location}</p>
                  <p>Comments: {allComments}</p>
                  <button type="button" value={item.id} className='manage-event-open' 
                  onClick={(e) => openEvent(e.target.value)}>Event Info</button>
                </div>}
                </li>
                ) : <li><h1>No Public to see ... try making some!</h1></li>
            }
        </ul>
        </div>
        <div><h1 style={{position: 'absolute', top: "10%", right: '5%'}}>RSO Events</h1>
          <ul className='manage-rso-events-list'>
            {
              RSOEvents.length > 0 ? RSOEvents.map(item=>
                <li key={item.id} value={item.id}>
                  {<div className='manage-event-card'>
                  <h2>Event: {item.name}</h2>
                  <p>{item.description}</p>
                  <p>{item.location}</p>
                  <button type="button" value={item.id} className='manage-event-open' 
                  onClick={(e) => openEvent(e.target.value)}>Event Info</button>
                </div>}
                </li>
                ) : <li><h1>No RSO Events to see ... try making some!</h1></li>
            }
        </ul>
      </div>
    </div>
      {
        selectedEvent && 
        <EventInfo event={selectedEvent} onClose={closeEvent} comments={allComments} ratings={allRatings}/>
      }
    </div>

  )
}

export default LandingPage;