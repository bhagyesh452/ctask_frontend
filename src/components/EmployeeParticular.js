import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Header from "./Header";
import { useParams } from "react-router-dom";
import { IconChevronLeft } from "@tabler/icons-react";
import { IconButton } from "@mui/material";
import { Link } from 'react-router-dom';

import DeleteIcon from "@mui/icons-material/Delete";


function EmployeeParticular() {
  const { id } = useParams();
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeName, setEmployeeName] = useState('');

  // Function to fetch employee details by id
  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/einfo`);
      
      // Find the employee by id and set the name
      const selectedEmployee = response.data.find(
        (employee) => employee._id === id
      );

      if (selectedEmployee) {
        setEmployeeName(selectedEmployee.ename);
      } else {
        // Handle the case where no employee is found with the given id
        setEmployeeName('Employee not found');
      }
    } catch (error) {
      console.error('Error fetching employee details:', error.message);
    }
  };

  // Function to fetch new data based on employee name
  const fetchNewData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/employees/${employeeName}`);
      setEmployeeData(response.data);
    } catch (error) {
      console.error('Error fetching new data:', error);
    }
  };

  useEffect(() => {
    // Fetch employee details and related data when the component mounts or id changes
    fetchEmployeeDetails();
  });
useEffect(()=>{
  if(employeeName){
    console.log("Employee found");
    fetchNewData();
  }else{
    console.log("No employees found");
  }

},[employeeName])
  

console.log(employeeData);

  // useEffect(() => {
  //   // Fetch new data based on employee name when the name changes
  //   if (employeeName !== 'Employee not found') {
  //     fetchNewData();
  //   }
  // }, [employeeName]);


  return (
    <div>
      <Header />
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                {/* <!-- Page pre-title --> */}
                <h2 className="page-title">Employee/{employeeName}</h2>
              </div>

              {/* <!-- Page title actions --> */}
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
                  <Link to={`/employees`}>
                    <IconButton>
                      <IconChevronLeft />
                    </IconButton>
                  </Link>

                  <a
                    href="#"
                    className="btn btn-primary d-sm-none btn-icon"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-report"
                    aria-label="Create new report"
                  >
                    {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div onCopy={(e)=>{
          e.preventDefault();
        }} className="page-body">
        <div className="container-xl">
          <div className="card">
            <div className="card-body">
              <div id="table-default" className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      
                      <th>
                        <button className="table-sort" data-sort="sort-name">
                          Sr.No
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-city">
                          Company Name
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-type">
                          Company Number
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-score">
                          Company Email
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          Company Incorporation Date
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          City
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          State
                        </button>
                      </th>
                      
                    </tr>
                  </thead>
                  {employeeData.length == 0 ? (
                    <div>No data available</div>
                  ) : (
                    employeeData.map((company, index) => (
                      <tbody className="table-tbody">
                        <tr>
                          
                          <td className="sort-name">
                            {index+1}
                          </td>
                          <td className="sort-name">
                            {company["Company Name"]}
                          </td>
                          <td className="sort-name">
                            {company["Company Number"]}
                          </td>
                          <td className="sort-name">
                            {company["Company Email"]}
                          </td>
                          <td className="sort-name">
                            {company["Company Incorporation Date  "]}
                          </td>
                          <td className="sort-name">{company["City"]}</td>
                          <td className="sort-name">{company["State"]}</td>
                         
                        </tr>
                      </tbody>
                    ))
                  )}
                  <tbody className="table-tbody"></tbody>
                </table>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default EmployeeParticular;
