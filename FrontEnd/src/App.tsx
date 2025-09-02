import { Provider } from "react-redux"
import { Store } from "./app/Store"
import { BrowserRouter, Route, Routes } from "react-router"
import Home from "./features/Home"
import Dashboard from "./features/Dashboard/Dashboard"
import ContactUs from "./features/ContactUs"
import CV from "./features/CV"
import LogInUser from "./features/Auth/LogInUser"
import SignUpUser from "./features/Auth/SignUpUser"


function App() {

  return (
    <>
    <Provider store={Store}>
      <BrowserRouter>
      <Routes>
        <Route Component={Home} path="/"></Route>  
        <Route Component={Dashboard} path="/dashboard/*"></Route>
        <Route Component={ContactUs} path="/contactus"></Route>
        <Route Component={CV} path="/cv"></Route>
        <Route Component={LogInUser} path ="/login"></Route>
        <Route Component={SignUpUser} path="/signup"></Route>
      </Routes>
      </BrowserRouter>
    </Provider>
    </>
  )
}

export default App
