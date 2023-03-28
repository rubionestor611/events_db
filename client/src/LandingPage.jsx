import './App.css';
import { useGlobalState } from "./GlobalState.js";

const LandingPage = () => {
  const [globalState, updateGlobalState] = useGlobalState();

  return(
    <div>
    
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <p style={{fontWeight: 'bold'}}>Welcome {globalState.user.username}!</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20 }}>
        <div>Private Events</div>
        <div>Public Events</div>
        <div>RSO Events</div>
      </div>

    </div>

  )
}

export default LandingPage;