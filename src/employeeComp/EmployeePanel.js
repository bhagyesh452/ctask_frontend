import React, { useEffect, useState } from "react";
import EmpNav from "./EmpNav.js";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IconChevronLeft } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import { IconButton } from "@mui/material";
import "./panel.css";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import Swal from "sweetalert2";

import CloseIcon from "@mui/icons-material/Close";

function EmployeePanel() {
  const [open, openchange] = useState(false);
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

  const functionopenpopup = () => {
    openchange(true);
  };
  const closepopup = () => {
    openchange(false);
  };

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

  const currentData = filteredData.slice(startIndex, endIndex);

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

  const [freezeIndex, setFreezeIndex] = useState(null);

  const handleFreezeIndexChange = (e) => {
    setFreezeIndex(Number(e.target.value));
  };

  const getCellStyle = (index) => {
    if (index === freezeIndex) {
      return {
        position: "sticky",
        left: 0,
        zIndex: 1,
        backgroundColor: "#f0f0f0",
      };
    }

    return {};
  };

  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }

  // Request form for Employees

  const [selectedYear, setSelectedYear] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [numberOfData, setNumberOfData] = useState("");

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleCompanyTypeChange = (event) => {
    setCompanyType(event.target.value);
  };

  const handleNumberOfDataChange = (event) => {
    setNumberOfData(event.target.value);
  };

  const handleSubmit = async (event) => {
    const name = data.ename;
    event.preventDefault();
    if (selectedOption === "notgeneral") {
      try {
        // Make API call using Axios
        const response = await axios.post(
          "http://localhost:3001/api/requestData",
          {
            selectedYear,
            companyType,
            numberOfData,
            name,
          }
        );

        console.log("Data sent successfully:", response.data);
        Swal.fire("Request sent!");
        closepopup();
      } catch (error) {
        console.error("Error:", error.message);
        Swal.fire("Please try again later!");
      }
    } else {
      try {
        // Make API call using Axios
        const response = await axios.post(
          "http://localhost:3001/api/requestgData",
          {
            numberOfData,
            name,
          }
        );

        console.log("Data sent successfully:", response.data);
        Swal.fire("Request sent!");
        closepopup();
      } catch (error) {
        console.error("Error:", error.message);
        Swal.fire("Please try again later!");
      }
    }
  };

  const [selectedOption, setSelectedOption] = useState("direct");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <Header name={data.ename} designation={data.designation} />
      <EmpNav userId={userId} />

      {/* Dialog box for Request Data */}

      <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
        <DialogTitle>
          Request Data{" "}
          <IconButton onClick={closepopup} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="form-control">
            <form
              onSubmit={handleSubmit}
              style={{ textAlign: "center", maxWidth: "400px", margin: "auto" }}
            >
              <div className="con2 d-flex">
                <div
                  style={{ margin: "10px 10px 0px 0px" }}
                  className="direct form-control"
                >
                  <input
                    type="radio"
                    id="general"
                    value="general"
                    checked={selectedOption === "general"}
                    onChange={handleOptionChange}
                  />
                  <label htmlFor="general">General Data</label>
                </div>
                <div
                  style={{ margin: "10px 0px 0px 10px" }}
                  className="indirect form-control"
                >
                  <input
                    type="radio"
                    id="notgeneral"
                    value="notgeneral"
                    checked={selectedOption === "notgeneral"}
                    onChange={handleOptionChange}
                  />
                  <label htmlFor="notgeneral">Manual Data</label>
                </div>
              </div>
              {selectedOption === "notgeneral" ? (
                <>
                  <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="selectYear">Select Year :</label>
                    <select
                      id="selectYear"
                      name="selectYear"
                      value={selectedYear}
                      onChange={handleYearChange}
                      style={{ padding: "8px" }}
                    >
                      {[...Array(2025 - 1970).keys()].map((year) => (
                        <option key={year} value={1970 + year}>
                          {1970 + year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label>Company Type :</label>
                    <input
                      type="radio"
                      id="llp"
                      name="companyType"
                      value="LLP"
                      checked={companyType === "LLP"}
                      onChange={handleCompanyTypeChange}
                      style={{ marginRight: "5px" }}
                    />
                    <label htmlFor="llp" style={{ marginRight: "15px" }}>
                      LLP
                    </label>
                    <input
                      type="radio"
                      id="pvtLtd"
                      name="companyType"
                      value="PVT LTD"
                      checked={companyType === "PVT LTD"}
                      onChange={handleCompanyTypeChange}
                      style={{ marginRight: "5px" }}
                    />
                    <label htmlFor="pvtLtd">PVT LTD</label>
                  </div>
                </>
              ) : (
                <div></div>
              )}

              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="numberOfData">Number of Data :</label>
                <input
                  type="number"
                  id="numberOfData"
                  name="numberOfData"
                  value={numberOfData}
                  onChange={handleNumberOfDataChange}
                  min="1"
                  required
                  style={{ padding: "8px" }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  background: "#4CAF50",
                  color: "white",
                  border: "none",
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Page Starts from here */}
      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                {/* <!-- Page pre-title --> */}
                <h2 className="page-title">{data.ename}</h2>
              </div>
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
                className="features"
              >
                <div style={{ display: "flex" }} className="feature1">
                  <div
                    className="form-control"
                    style={{ height: "fit-content", width: "15vw" }}
                  >
                    <select
                      style={{
                        border: "none",
                        outline: "none",
                        width: "fit-content",
                      }}
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
                  </div>
                  {visibility === "block" ? (
                    <div>
                      <input
                        onChange={handleDateChange}
                        style={{ display: visibility }}
                        type="date"
                        className="form-control"
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {visibilityOther === "block" ? (
                    <div
                      style={{
                        width: "20vw",
                        margin: "0px 10px",
                        display: visibilityOther,
                      }}
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
                  ) : (
                    <div></div>
                  )}
                  {visibilityOthernew === "block" ? (
                    <div
                      style={{
                        width: "20vw",
                        margin: "0px 10px",
                        display: visibilityOthernew,
                      }}
                      className="input-icon form-control"
                    >
                      <select
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
                  ) : (
                    <div></div>
                  )}
                  {searchText !== "" ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "16px",
                        fontFamily: "sans-serif",
                      }}
                      className="results"
                    >
                      {filteredData.length} results found
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  className="feature2"
                >
                  {selectedField === "State" && (
                    <div style={{ width: "15vw" }} className="input-icon">
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
                    <>
                      <div
                        style={{ width: "fit-content" }}
                        className="form-control"
                      >
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
                      <div className="input-icon">
                        <input
                          type="number"
                          value={year}
                          defaultValue="Select Year"
                          className="form-control"
                          placeholder="Select Year.."
                          onChange={(e) => {
                            setYear(e.target.value);
                          }}
                          aria-label="Search in website"
                        />
                      </div>
                    </>
                  )}
                  <div className="request">
                    <div className="btn-list">
                      <button
                        onClick={functionopenpopup}
                        className="btn btn-primary d-none d-sm-inline-block"
                      >
                        Request Data
                      </button>
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

              {/* <!-- Page title actions --> */}
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
              <div className="card-body p-0">
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      border: "1px solid #ddd",
                    }}
                    className="table-vcenter table-nowrap"
                  >
                    <thead>
                      <tr style={{ backgroundColor: "#f2f2f2" }}>
                        <th
                          style={{ position: "sticky", left: "0px", zIndex: 1 }}
                        >
                          Sr.No
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            left: "80px",
                            zIndex: 1,
                          }}
                        >
                          Company Name
                        </th>
                        <th>Company Number</th>
                        <th>Company Email</th>
                        <th>Incorporation Date</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Status</th>
                        <th>Remarks</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {currentData.length === 0 ? (
                      <tbody>
                        <tr>
                          <td colSpan="10" style={{ textAlign: "center" }}>
                            No data available
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        {currentData.map((company, index) => (
                          <tr key={index} style={{ border: "1px solid #ddd" }}>
                            <td
                              style={{
                                position: "sticky",
                                left: "0px",
                                zIndex: 1,
                                background: "white",
                              }}
                            >
                              {startIndex + index + 1}
                            </td>
                            <td
                              style={{
                                position: "sticky",
                                left: "0px",
                                zIndex: 1,
                                background: "white",
                              }}
                            >
                              {company["Company Name"]}
                            </td>
                            <td>{company["Company Number"]}</td>
                            <td>{company["Company Email"]}</td>
                            <td>
                              {formatDate(
                                company["Company Incorporation Date  "]
                              )}
                            </td>
                            <td>{company["City"]}</td>
                            <td>{company["State"]}</td>
                            <td>
                              <select
                                style={{
                                  width: "100%",
                                  padding: ".4375rem .75rem",
                                  border: "1px solid var(--tblr-border-color)",
                                  borderRadius: "var(--tblr-border-radius)",
                                }}
                                value={company["Status"]}
                                onChange={(e) =>
                                  handleStatusChange(
                                    company._id,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="Untouched">Untouched </option>
                                <option value="Busy">Busy </option>
                                <option value="Not Picked Up">
                                  Not Picked Up
                                </option>
                                <option value="Junk">Junk</option>
                                <option value="Interested">Interested</option>
                                <option value="Not Interested">
                                  Not Interested
                                </option>
                              </select>
                            </td>
                            <td>
                              <textarea
                                defaultValue={company["Remarks"]}
                                onChange={(e) =>
                                  handlenewFieldChange(
                                    company._id,
                                    "Remarks",
                                    e.target.value
                                  )
                                }
                                type="text"
                                style={{
                                  padding: ".4375rem .75rem",
                                  border:
                                    " var(--tblr-border-width) solid var(--tblr-border-color)",
                                  borderRadius: "var(--tblr-border-radius)",
                                  boxShadow: "0 0 transparent",
                                  transition:
                                    "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                                  height: "34px",
                                }}
                              />
                            </td>
                            <td>
                              <button
                                onClick={() => handleUpdate(company._id)}
                                disabled={!isUpdateButtonEnabled(company._id)}
                                style={{
                                  padding: "5px",
                                  fontSize: "12px",
                                  backgroundColor: "green",
                                  // transition: "background-color 0.3s ease", // Smooth transition effect
                                  ":hover": {
                                    backgroundColor: "lightgreen !important", // Background color when hovered
                                  },
                                }}
                                className="btn btn-primary d-none d-sm-inline-block"
                              >
                                Update
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
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
