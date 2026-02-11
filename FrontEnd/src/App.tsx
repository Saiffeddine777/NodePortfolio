import { Route, Routes, /* useNavigate, type NavigateFunction */ } from "react-router";
import Home from "./features/Home.tsx";
import Dashboard from "./features/Dashboard/Dashboard.tsx";
import ContactUs from "./features/ContactUs.tsx";
import CV from "./features/CV.tsx";
import LogInUser from "./features/Auth/LogInUser.tsx";
import SignUpUser from "./features/Auth/SignUpUser.tsx";
import React from "react";
import { useAppDispatch, useAppSelector } from "./app/Hooks.ts";
import { api } from "./ApiService/ApiBrain.ts";
import { setUserFromToken } from "./features/Auth/UserAuthReducer.ts";
import { handleComponentError } from "./Helpers/ErrorHandler.ts";
import OneProjectUserSide from "./features/HomeComponents/OneProjectUserSide.tsx";
import AuthenticatedUser from "./features/Auth/AuthenticatedUser.tsx";
import ModifyUser from "./features/Dashboard/Users/ModifyUser.tsx";
import InputEmail from "./features/Auth/InputEmail.tsx";
import ChangePassword from "./features/Auth/ChangePassword.tsx";

const tokenIsHere= localStorage.getItem("accessToken")

function App() {
  // const navigate :NavigateFunction = useNavigate()
  const user = useAppSelector(state => state.userAuth.authUser)
  const dispatch = useAppDispatch()
  const fetchUserWithToken: ()=>Promise <void> = async  function(){
    try{
    
     const {data}=  await api.get ("/api/users/token")
     dispatch(setUserFromToken(data))
    }catch(error){
      handleComponentError(error)
    }
  }

  React.useEffect(()=>{
    if (!user && tokenIsHere){
      fetchUserWithToken()
    }
    // navigate("/")
  },[])

  return (
        <Routes>
          <Route Component={Home} path="/"/>
          <Route Component={Dashboard} path="/dashboard/*"/>
          <Route Component={ContactUs} path="/contactus"/>
          <Route Component={CV} path="/cv"/>
          <Route Component={LogInUser} path="/login"/>
          <Route Component={SignUpUser} path="/signup"/>
          <Route Component={OneProjectUserSide} path="/oneprojectuser"/>
          <Route Component={AuthenticatedUser} path ="/authenticateduser"/>
          <Route Component={ModifyUser} path="/modifyyourprofile"/>
          <Route Component={InputEmail} path="/sendemail"/>
          <Route Component={ChangePassword} path="/changepassword"/>
          <Route Component={ChangePassword} path={"/changepassword/:token"}/>
        </Routes>
  );
}

export default App;
