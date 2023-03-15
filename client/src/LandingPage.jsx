import { useGlobalState } from "./GlobalState.js";

const LandingPage = () => {
  const [globalState, updateGlobalState] = useGlobalState();

  return(
    <div>
      <p>Welcome to app {globalState.user.username}!</p>
    </div>
  )
}

export default LandingPage;