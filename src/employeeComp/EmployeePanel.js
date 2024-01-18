import React, { useEffect, useState } from "react";
import EmpNav from "./EmpNav.js";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IconChevronLeft } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";

function EmployeePanel() {
  const [data, setData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [citySearch, setcitySearch] = useState("");
  const [visibility, setVisibility] = useState("none");
  const [visibilityOther, setVisibilityOther] = useState("block");
  const [visibilityOthernew, setVisibilityOthernew] = useState("none");
  const [subFilterValue, setSubFilterValue] = useState("");
  const [selectedField, setSelectedField] = useState("Company Name");
  const [currentPage, setCurrentPage] = useState(0);
  const [month, setMonth] = useState(0);
  const [updateData, setUpdateData] = useState({});
  const itemsPerPage = 10;
  const [year, setYear] = useState(0);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const { userId } = useParams();
  console.log(userId);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/einfo");

      // Set the retrieved data in the state
      const tempData = response.data;
      const userData = tempData.find((item) => item._id === userId);

      setData(userData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchNewData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/employees/${data.ename}`
      );
      setEmployeeData(response.data);
    } catch (error) {
      console.error("Error fetching new data:", error);
    }
  };
  const handleFieldChange = (event) => {
    if (event.target.value === "Company Incorporation Date  ") {
      setSelectedField(event.target.value);
      setVisibility("block");
      setVisibilityOther("none");
      setSubFilterValue("");
      setVisibilityOthernew("none");
    } else if (event.target.value === "Status") {
      setSelectedField(event.target.value);
      setVisibility("none");
      setVisibilityOther("none");
      setSubFilterValue("");
      setVisibilityOthernew("block");
    } else {
      setSelectedField(event.target.value);
      setVisibility("none");
      setVisibilityOther("block");
      setSubFilterValue("");
      setVisibilityOthernew("none");
    }

    console.log(selectedField);
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setCurrentPage(0);

    // Check if the dateValue is not an empty string
    if (dateValue) {
      const dateObj = new Date(dateValue);
      const formattedDate = dateObj.toISOString().split("T")[0];
      setSearchText(formattedDate);
    } else {
      // Handle the case when the date is cleared
      setSearchText("");
    }
  };

  useEffect(() => {
    if (data.ename) {
      console.log("Employee found");
      fetchNewData();
    } else {
      console.log("No employees found");
    }
  }, [data.ename]);

  useEffect(() => {
    fetchData();
  }, [userId]);

  console.log(employeeData);

  const filteredData = employeeData.filter((company) => {
    const fieldValue = company[selectedField];

    if (selectedField === "State" && citySearch) {
      // Handle filtering by both State and City
      const stateMatches = fieldValue
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const cityMatches = company.City.toLowerCase().includes(
        citySearch.toLowerCase()
      );
      return stateMatches && cityMatches;
    } else if (selectedField === "Company Incorporation Date  ") {
      // Assuming you have the month value in a variable named `month`
      if (month == 0) {
        return fieldValue.includes(searchText);
      } else if (year == 0) {
        return fieldValue.includes(searchText);
      }
      const selectedDate = new Date(fieldValue);
      const selectedMonth = selectedDate.getMonth() + 1; // Months are 0-indexed
      const selectedYear = selectedDate.getFullYear();

      // Use the provided month variable in the comparison
      return (
        selectedMonth.toString().includes(month) &&
        selectedYear.toString().includes(year)
      );
    } else if (selectedField === "Status" && searchText === "All") {
      // Display all data when Status is "All"
      return true;
    } else {
      // Your existing filtering logic for other fields
      if (typeof fieldValue === "string") {
        return fieldValue.toLowerCase().includes(searchText.toLowerCase());
      } else if (typeof fieldValue === "number") {
        return fieldValue.toString().includes(searchText);
      } else if (fieldValue instanceof Date) {
        // Handle date fields
        return fieldValue.includes(searchText);
      }

      return false;
    }
  });

  const handleStatusChange = async (employeeId, newStatus) => {
    console.log(employeeId, newStatus);
    
      try {
        // Make an API call to update the employee status in the database
        const response = await axios.post(
          `http://localhost:3001/update-status/${employeeId}`,
          {
            newStatus,
          }
        );
  
        // Check if the API call was successful
        if (response.status === 200) {
          // If successful, update the employeeData state or fetch data again to reflect changes
          fetchData(); // Assuming fetchData is a function to fetch updated employee data
  
          
          window.location.reload();
        } else {
          // Handle the case where the API call was not successful
          console.error("Failed to update status:", response.data.message);
        }
      } catch (error) {
        // Handle any errors that occur during the API call
        console.error("Error updating status:", error.message);
      }

    
    
  };

  const handlenewFieldChange = (companyId, field, value) => {
    setUpdateData((prevData) => ({
      ...prevData,
      [companyId]: {
        ...prevData[companyId],
        [field]: value,
        isButtonEnabled: true, // Enable the button when any field changes
      },
    }));
  };

  const isUpdateButtonEnabled = (companyId) => {
    return updateData[companyId]?.isButtonEnabled || false;
  };

  const handleUpdate = async (companyId) => {
    const { Remarks } = updateData[companyId];

    // Now you have the updated Status and Remarks, perform the update logic
    console.log(Remarks);
    
    
      try {
        // Make an API call to update the employee status in the database
        const response = await axios.post(
          `http://localhost:3001/update-remarks/${companyId}`,
          {
            Remarks,
          }
        );

        // Check if the API call was successful
        if (response.status === 200) {
          // If successful, update the employeeData state or fetch data again to reflect changes
          fetchData(); // Assuming fetchData is a function to fetch updated employee data

          
          window.location.reload();
        } else {
          // Handle the case where the API call was not successful
          console.error("Failed to update status:", response.data.message);
        }
      } catch (error) {
        // Handle any errors that occur during the API call
        console.error("Error updating status:", error.message);
      }

      setUpdateData((prevData) => ({
        ...prevData,
        [companyId]: {
          ...prevData[companyId],
          isButtonEnabled: false,
        },
      }));
    

    // After updating, you can disable the button
  };

  return (
    <div>
      <Header name={data.ename} />
      <EmpNav />
      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                {/* <!-- Page pre-title --> */}
                <h2 className="page-title">Welcome, {data.ename}</h2>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",

                  alignItems: "center",
                }}
                className="feature1"
              >
                <div style={{ margin: "20px 0px" }} className="filter">
                  <div style={{ display: "flex" }} className="mb-0">
                    <div className="form-control">
                      <select
                        style={{ border: "none", outline: "none" }}
                        value={selectedField}
                        onChange={handleFieldChange}
                      >
                        <option value="Company Name">Company Name</option>
                        <option value="Company Number">Company Number</option>
                        <option value="Company Email">Company Email</option>
                        <option value="Company Incorporation Date  ">
                          Company Incorporation Date
                        </option>
                        <option value="City">City</option>
                        <option value="State">State</option>
                        <option value="Status">Status</option>
                      </select>
                      {/* <Select value={selectedField} onChange={handleFieldChange}>
                      <MenuItem value="Company Name">Company Name</MenuItem>
                      <MenuItem value="Company Number">Company Number</MenuItem>
                      <MenuItem value="Company Email">Company Email</MenuItem>
                      <MenuItem value="Company Incorporation Date  ">Company Incorporation Date</MenuItem>
                      <MenuItem value="City">City</MenuItem>
                      <MenuItem value="State">State</MenuItem>
                    
                    </Select> */}
                    </div>

                    <input
                      onChange={handleDateChange}
                      style={{ display: visibility }}
                      type="date"
                      className="form-control"
                    />
                  </div>
                </div>

                <div
                  style={{ margin: "0px 10px", display: visibilityOther }}
                  className="searchbar"
                >
                  <div style={{ width: "20vw" }} className="input-icon">
                    <span className="input-icon-addon">
                      {/* <!-- Download SVG icon from http://tabler-icons.io/i/search --> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon"
                        width="20"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(0);
                      }}
                      className="form-control"
                      placeholder="Search…"
                      aria-label="Search in website"
                    />
                  </div>
                </div>
                <div
                  style={{ margin: "0px 10px", display: visibilityOthernew }}
                  className="searchbar"
                >
                  <div style={{ width: "20vw" }} className="input-icon">
                    <select
                      className="form-control"
                      value={searchText}
                      onChange={(e) => {
                        setSearchText(e.target.value);
                      }}
                    >
                      <option value="All">All </option>
                      <option value="Busy ">Busy </option>
                      <option value="Not Picked Up ">Not Picked Up </option>
                      <option value="Junk">Junk</option>
                      <option value="Interested">Interested</option>
                      <option value="Not Interested">Not Interested</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="subfilter">
                {selectedField === "State" && (
                  <div style={{ width: "15vw" }} className="input-icon">
                    <hr style={{ margin: "10px" }} />
                    <span className="input-icon-addon">
                      {/* <!-- Download SVG icon from http://tabler-icons.io/i/search --> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon"
                        width="20"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      value={citySearch}
                      onChange={(e) => {
                        setcitySearch(e.target.value);
                        setCurrentPage(0);
                      }}
                      placeholder="Search City"
                      aria-label="Search in website"
                    />
                  </div>
                )}
                {selectedField === "Company Incorporation Date  " && (
                  <div style={{ width: "fit-content" }} className="form-control">
                  
                    <div  className="mb-0">
                      <div className="form-control">
                        <select
                          style={{ border: "none", outline: "none" }}
                          onChange={(e) => {
                            setMonth(e.target.value);
                            setCurrentPage(0);
                          }}
                        >
                          <option value="" disabled selected>
                            Select Month
                          </option>
                          <option value="12">December</option>
                          <option value="11">November</option>
                          <option value="10">October</option>
                          <option value="9">September</option>
                          <option value="8">August</option>
                          <option value="7">July</option>
                          <option value="6">June</option>
                          <option value="5">May</option>
                          <option value="4">April</option>
                          <option value="3">March</option>
                          <option value="2">February</option>
                          <option value="1">January</option>
                        </select>
                      </div>
                      <div className="form-control">
                        <div
                          style={{ width: "fit-content" }}
                          className="input-icon"
                        >
                          <span className="input-icon-addon">
                            {/* <!-- Download SVG icon from http://tabler-icons.io/i/search --> */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon"
                              width="20"
                              height="24"
                              viewBox="0 0 24 24"
                              stroke-width="2"
                              stroke="currentColor"
                              fill="none"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                              <path d="M21 21l-6 -6" />
                            </svg>
                          </span>
                          <input
                            type="number"
                            className="form-control"
                            value={year}
                            onChange={(e) => {
                              setYear(e.target.value);
                            }}
                            placeholder="Search by Year"
                            aria-label="Search in website"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* <!-- Page title actions --> */}
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
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
        <div
          onCopy={(e) => {
            e.preventDefault();
          }}
          className="page-body"
        >
          <div className="container-xl">
            <div className="card">
              <div className="card-body">
                <div style={{overflowY : "auto"}} id="table-default" className="table-responsive">
                  <table style={{width:"100%"}} className="table">
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
                        <th>
                          <button className="table-sort" data-sort="sort-date">
                            Status
                          </button>
                        </th>
                        <th>
                          <button className="table-sort" data-sort="sort-date">
                            Remarks
                          </button>
                        </th>
                        <th>
                          <button className="table-sort" data-sort="sort-date">
                            Action
                          </button>
                        </th>
                      </tr>
                    </thead>
                    {filteredData.length == 0 ? (
                      <div>No data available</div>
                    ) : (
                      filteredData.map((company, index) => (
                        <tbody className="table-tbody">
                          <tr>
                            <td className="sort-name">{index + 1}</td>
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
                              {
                                new Date(
                                  company["Company Incorporation Date  "]
                                )
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </td>
                            <td className="sort-name">{company["City"]}</td>
                            <td className="sort-name">{company["State"]}</td>
                            <td className="sort-name">
                              <select
                                className="form-control"
                                value={company["Status"]}
                                onChange={(e) => {
                                  handleStatusChange(
                                    company._id,
                                    e.target.value
                                  );
                                }}
                              >
                                <option value="Busy ">Busy </option>
                                <option value="Not Picked Up ">
                                  Not Picked Up{" "}
                                </option>
                                <option value="Junk">Junk</option>
                                <option value="Interested">Interested</option>
                                <option value="Not Interested">
                                  Not Interested
                                </option>
                              </select>
                            </td>
                            <td className="sort-name">
                              <input
                              defaultValue={company["Remarks"]}
                                onChange={(e) =>
                                  handlenewFieldChange(
                                    company._id,
                                    "Remarks",
                                    e.target.value
                                  )
                                }
                                type="text"
                                className="form-control"
                              />
                            </td>
                            <td className="sort-name">
                              <button
                                onClick={() => handleUpdate(company._id)}
                                disabled={!isUpdateButtonEnabled(company._id)}
                                className="btn btn-primary d-none d-sm-inline-block"
                              >
                                Update
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      ))
                    )}
                    <tbody className="table-tbody"></tbody>
                  </table>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "10px",
                  }}
                  className="pagination"
                >
                  <IconButton
                    onClick={() =>
                      setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))
                    }
                    disabled={currentPage === 0}
                  >
                    <IconChevronLeft />
                  </IconButton>
                  <span>
                    Page {currentPage + 1} of{" "}
                    {Math.ceil(filteredData.length / itemsPerPage)}
                  </span>

                  <IconButton
                    onClick={() =>
                      setCurrentPage((prevPage) =>
                        Math.min(
                          prevPage + 1,
                          Math.ceil(filteredData.length / itemsPerPage) - 1
                        )
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(filteredData.length / itemsPerPage) - 1
                    }
                  >
                    <IconChevronRight />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeePanel;
