import { useState, createContext, useContext } from "react"

// The initial state, you can setup any properties initilal values here.
const initialState = {
    user: {}
}

// create the context object for delivering your state across your app.
const GlobalContext = createContext(null)

// custom component to provide the state to your app
export const GlobalState = (props) => {
  // declare the GlobalState
  const [globalState, setGlobalState] = useState({})

  // create a function that'll make it easy to update one state property at a time
  const updateGlobalState = (key, newValue) => {
    setGlobalState(oldState => {
      if (oldState[key] !== newValue) {
        const newState = { ...oldState }
        newState[key] = newValue
        return newState
      } else {
        return oldState
      }
    })
  }

  return (
    <GlobalContext.Provider value={[globalState, updateGlobalState]}>{props.children}</GlobalContext.Provider>
  )
}

// custom hook for retrieving the provided state
export const useGlobalState = () => useContext(GlobalContext)