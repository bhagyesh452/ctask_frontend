import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import { useState } from "react";
import NewCard from "./NewCard";
import axios from "axios";
import NewGCard from "./NewGcard";


function ShowNotification() {
  const [RequestData, setRequestData] = useState([]);
  const [RequestGData, setRequestGData] = useState([]);

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/requestData');
      setRequestData(response.data);
      
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };
  const fetchRequestGDetails = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/requestgData');
      setRequestGData(response.data);
      
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(()=>{
    fetchRequestDetails();
    fetchRequestGDetails();
  },[])
  return (
    <div>
      {" "}
      <Header />
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                {/* <!-- Page pre-title --> */}
                <h2 className="page-title">Notifications</h2>
              </div>
            </div>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px"
            }} className="maincontent">
              {RequestData.length!== 0 ? (
                RequestData.map((company)=>(
                    <NewCard name={company.ename} year={company.year} ctype = {company.ctype} damount = {company.dAmount}/>
                ))
              ) : (
                <div>
                  No new Notifications
                  </div>
              )}
              {RequestGData.length!== 0 ? (
                RequestGData.map((company)=>(
                    <NewGCard name={company.ename}  damount = {company.dAmount}/>
                ))
              ) : (
                <div>
                  No new Notifications
                  </div>
              )}
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowNotification;
