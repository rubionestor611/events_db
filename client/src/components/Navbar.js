import { Link, useMatch, useResolvedPath} from "react-router-dom"
import { useGlobalState } from "../GlobalState.js";
export default function Navbar(){
  const [globalState, updateGlobalState] = useGlobalState();
  // navbar cases
  // not signed in yet
  // signed in as typical user
  // signed in as admin user
  // signed in as super admin
  if(!globalState.user){
    return (null)
  }

  if(globalState.user.auth_level == 1){
    return(
      <nav className="nav">
        <Link to = "/landing" className="site-title">Events</Link>
        <ul>
          <CustomLink to="/landing">Home</CustomLink>
          <CustomLink to="/createrso">create rso</CustomLink>
          <CustomLink to="/joinrso">join rso</CustomLink>
        </ul>
        <Link onClick={()=>updateGlobalState("user", null)} to="/">Sign Out</Link>
      </nav>
    )
    
  }

  if(globalState.user.auth_level == 2){
    return(
      <nav className="nav">
        <Link to = "/landing" className="site-title">Events</Link>
        <ul>
          <CustomLink to="/landing">Home</CustomLink>
          <CustomLink to="/createrso">create rso</CustomLink>
          <CustomLink to="/joinrso">join rso</CustomLink>
          <CustomLink to="/createevent">create event</CustomLink>      
        </ul>
        <Link onClick={()=>updateGlobalState("user", null)} to="/">Sign Out</Link>
      </nav>
    )
    
  }

  if(globalState.user.auth_level == 3){
    return (
      <nav className="nav">
        <Link to = "/landing" className="site-title">Events</Link>
        <ul>
            <CustomLink to="/landing">Home</CustomLink>
            {/*<CustomLink to="/createrso">create rso</CustomLink>
            <CustomLink to="/joinrso">join rso</CustomLink>*/}
            <CustomLink to="/superadmin/createuniversity">Create uni</CustomLink>
            <CustomLink to="/superadmin/manageuniversities">Manage Unis</CustomLink>
            <CustomLink to="/superadmin/events">Event Requests</CustomLink>
        </ul>
        <Link onClick={()=>updateGlobalState("user", null)} to="/">Sign Out</Link>
      </nav>)
    
  }

  return (null)
}

function CustomLink({to, children, ...props}){
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({path: resolvedPath.pathname, end:true});
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}