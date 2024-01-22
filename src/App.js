import logo from './logo.svg';
import './App.css';
import LoginAdmin from './components/LoginAdmin';
import { BrowserRouter, Routes,Navigate, Route } from "react-router-dom";
import Dashboard from './components/Dashboard';
import Employees from './components/Employees';
import EmployeeParticular from './components/EmployeeParticular';
import { useState } from 'react';
import Home from './components/Home';
import Logout from './components/Logout';
import Leads from './components/Leads';
import EmployeeLogin from './components/EmployeeLogin';
import EmployeePanel from './employeeComp/EmployeePanel';
import ShowNotification from './components/ShowNotification';


function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [newtoken, setnewToken] = useState(localStorage.getItem('newtoken') || null);
  
  

  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      <Route
          path="/login"
          element={<LoginAdmin setToken={setToken} />}
        />
        {token ? (<>
          <Route path="/home" element={<Dashboard/>}/>
          <Route path="/employees" element={<Employees/>}/>
          <Route path="/employees/:id"  element={<EmployeeParticular/>}/>
          <Route path="/leads" element={<Leads/>}/>
          <Route path="/notification" element={<ShowNotification/>}/>

          
                  
        </>
          ): (
          <Route
            path="/home"
            element={<Navigate to="/login" />}
          />
        )}
        <Route path="/*" element={<Navigate to="/login" />} />
        <Route path="/employeelogin" element={<EmployeeLogin setnewToken={setnewToken} />} />
          <Route
            path="/employee-data/:userId"
            element={
              newtoken ? (
                <EmployeePanel />
              ) : (
                <Navigate to="/employeelogin" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
     
    </div>
  );
}


export default App;

{/* <Route path='/login' element={<LoginAdmin/>}/>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/employees' element={<Employees/>}/> */}