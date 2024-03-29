import "./App.css";

import { BrowserRouter, Routes, Navigate, Route, Outlet } from "react-router-dom";
import { useState } from "react";

import EmployeeLogin from "./components/EmployeeLogin";
import ConveertedLeads from "./components/ConveertedLeads";
import EmployeePanel from "./employeeComp/EmployeePanel";

function App() {
  const [newtoken, setnewToken] = useState(
    localStorage.getItem("newtoken") || null
  );

  return (
    <div className="App">
     <BrowserRouter>
        <Routes>
          <Route
            path="/employeelogin"
            element={<EmployeeLogin setnewToken={setnewToken} />}
          />
          <Route
            path="/employee-data/:userId/"
            element={
              newtoken ? (
                <EmployeePanel />
              ) : (
                <Navigate to="/employeelogin" />
              )
            }
          >
                </Route>
          <Route
            path="/converted-leads/:userId/"
            element={
              newtoken ? (
                <ConveertedLeads />
              ) : (
                <Navigate to="/employeelogin" />
              )
            }
          >
                </Route>
      
          <Route path="/*" element={<Navigate to="/employeelogin" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

{
  /* <Route path='/login' element={<LoginAdmin/>}/>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/employees' element={<Employees/>}/> */
}
