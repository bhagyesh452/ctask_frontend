import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import { useState} from "react";
// import LoginAdmin from "./LoginAdmin";

function Dashboard() {
  // const stopPrntScr = () => {
  //   const inpFld = document.createElement("input");
  //   inpFld.setAttribute("value", ".");
  //   inpFld.setAttribute("width", "0");
  //   inpFld.style.height = "0px";
  //   inpFld.style.width = "0px";
  //   inpFld.style.border = "0px";
  //   document.body.appendChild(inpFld);
  //   inpFld.select();
    
  //   try {
  //     navigator.clipboard.writeText("");
  //   } catch (err) {
  //     console.error('Unable to access clipboard:', err);
  //   } finally {
  //     inpFld.remove();
  //   }
  // };

  // const accessClipboardData = () => {
  //   try {
  //     navigator.clipboard.writeText("Access Restricted");
  //   } catch (err) {
  //     console.error('Unable to access clipboard:', err);
  //   }
  // };

  // useEffect(() => {
  //   const handleKeyUp = (e) => {
  //     const keyCode = e.keyCode ? e.keyCode : e.which;
  //     if (keyCode === 44) {
  //       stopPrntScr();
  //     }
  //   };

  //   const clipboardInterval = setInterval(accessClipboardData, 300);

  //   document.addEventListener("keyup", handleKeyUp);

  //   return () => {
  //     document.removeEventListener("keyup", handleKeyUp);
  //     clearInterval(clipboardInterval);
  //   };
  // }, []);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // useEffect(() => {
   
  //   const checkLoginStatus = () => {
  //     if (sessionStorage.getItem('isLoggedin')==='') {
  //       setIsLoggedIn(true);
  //     } else {
  //       setIsLoggedIn(false);
  //     }
  //   };

  //   checkLoginStatus();
  // }, []);
  
  // const handleLogin = ()=>{
  //   setIsLoggedIn(true)
  // }
  return (
    <div>
      <Header/>
      <Navbar/>
      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                {/* <!-- Page pre-title --> */}
                <h2 className="page-title">Dashboard</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Dashboard;
