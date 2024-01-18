import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Navbar from "./Navbar";
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import LoginAdmin from "./LoginAdmin";
import "../dist/css/tabler.min.css?1684106062";
import "../dist/css/tabler-flags.min.css?1684106062";
import "../dist/css/tabler-payments.min.css?1684106062";
import "../dist/css/tabler-vendors.min.css?1684106062";
import "../dist/css/demo.min.css?1684106062";
// import EmployeeTable from "./EmployeeTable";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Modal from "react-modal";
import { IconEye } from "@tabler/icons-react";

function Employees({onEyeButtonClick}) {
  // const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedin')==='true');
  // const handleLogin = ()=>{
  //   setIsLoggedIn(true)
  // }
  const handleEyeButtonClick = (id) => {
    // Call the callback function provided by the parent component
    onEyeButtonClick(id);
    console.log(id);
  };
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDeleteClick = (itemId) => {
    // Open the confirm delete modal
    setItemIdToDelete(itemId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Perform the delete operation here (call your delete API, etc.)
    // After deletion, close the modal
    handleDelete(itemIdToDelete);
    setIsModalOpen(false);
  };
  const handleCancelDelete = () => {
    // Cancel the delete operation and close the modal
    setIsModalOpen(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedDataId, setSelectedDataId] = useState("2024-01-03");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState(0);
  const [ename, setEname] = useState("");
  const [jdate, setJdate] = useState(null);

  const [open, openchange] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/einfo");

      // Set the retrieved data in the state

      setFilteredData(response.data);
      setData(response.data);
      setEmail("");
      setEname("");
      setNumber(0);
      setPassword("");
      setJdate(null);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter the data based on the search query (case-insensitive partial match)
    const filtered = data.filter((item) =>
      item.email.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredData(filtered);
  };
  const handleUpdateClick = (id) => {
    // Set the selected data ID and set update mode to true
    setSelectedDataId(id);
    setIsUpdateMode(true);

    // Find the selected data object
    const selectedData = data.find((item) => item._id === id);

    // Update the form data with the selected data values
    setEmail(selectedData.email);
    setEname(selectedData.ename);
    setNumber(selectedData.number);
    setPassword(selectedData.password);
    const dateObject = new Date(selectedData.jdate);
    const day = dateObject.getDate().toString().padStart(2, "0"); // Ensure two-digit day
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = dateObject.getFullYear();
    const formattedDateString = `${year}-${month}-${day}`;

    // setJdate('2004-04-04');
    setJdate(formattedDateString);

    // // Get individual date components

    // // Create the formatted date string in "dd-mm-yyyy" format

    // console.log(formattedDateString); // Output: "04-01-2024"
    //     console.log(jdate);
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/einfo/${id}`);
      // Refresh the data after successful deletion
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  useEffect(() => {
    // Fetch data from the Node.js server
    setFilteredData(data);
    // Call the fetchData function
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    console.log(jdate);
    const referenceId = uuidv4();
    try {
      if (isUpdateMode) {
        await axios.put(`http://localhost:3001/einfo/${selectedDataId}`, {
          email: email,
          number: number,
          ename: ename,
          password: password,
          jdate: jdate,
        });
      } else {
        await axios.post("http://localhost:3001/einfo", {
          email: email,
          number: number,
          ename: ename,
          password: password,
          jdate: jdate,   
          
        });
      }
      setEmail("");
      setEname("");
      setNumber(0);
      setPassword("");
      setJdate(null);
      setIsUpdateMode(false);
      fetchData();
      closepopup();
      console.log("Data send successfully");
    } catch {
      console.error("Internal server error");
    }
  };
  const functionopenpopup = () => {
    openchange(true);
  };
  const closepopup = () => {
    openchange(false);
  };

//   cInfo:{
//     "Company Name": referenceId + "company",

// "Company Email": referenceId + "email",
// "Company Incorporation Date  ": new Date(),
// "Company Number": Math.floor(Math.random() * 1000000),
// City: referenceId + "city",
// State: referenceId + "state",
//   }       

  // const formattedDate = new Date(jdate).toLocaleDateString();
  //   console.log('Formatted Date:', formattedDate);

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "fit-content",
            height: "fit-content",
            margin: "auto",
            textAlign: "center",
          },
        }}
      >
        <div className="modal-header">
          <h3 style={{ fontSize: "20px" }} className="modal-title">
            Confirm Delete?
          </h3>
        </div>

        <button
          className="btn btn-primary ms-auto"
          onClick={handleConfirmDelete}
        >
          Yes, Delete
        </button>
        <button
          className="btn btn-link link-secondary"
          onClick={handleCancelDelete}
        >
          Cancel
        </button>
      </Modal>
      <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
        <DialogTitle>
          Employee Info{" "}
          <IconButton onClick={closepopup} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Employee Name</label>
                  <input
                    type="text"
                    value={ename}
                    className="form-control"
                    name="example-text-input"
                    placeholder="Your report name"
                    onChange={(e) => {
                      setEname(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    value={email}
                    type="email"
                    className="form-control"
                    name="example-text-input"
                    placeholder="Your report name"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    value={password}
                    className="form-control"
                    name="example-text-input"
                    placeholder="Your report name"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label className="form-label">Phone No.</label>
                    <input
                      value={number}
                      type="number"
                      className="form-control"
                      onChange={(e) => {
                        setNumber(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label className="form-label">Joining Date</label>
                    <input
                      value={jdate}
                      type="date"
                      onChange={(e) => {
                        setJdate(e.target.value);
                      }}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </Dialog>

      <Header />
      <Navbar number={1} />
      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                {/* <!-- Page pre-title --> */}
                <h2 className="page-title">Employees</h2>
              </div>
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
                  value={searchQuery}
                  className="form-control"
                  placeholder="Search…"
                  aria-label="Search in website"
                  onChange={handleSearch}
                />
              </div>

              {/* <!-- Page title actions --> */}
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
                  <button
                    className="btn btn-primary d-none d-sm-inline-block"
                    onClick={functionopenpopup}
                  >
                    {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 5l0 14" />
                      <path d="M5 12l14 0" />
                    </svg>
                    Add Employees
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
        </div>
      </div>
    
      {/* Employee table */}
      <div onCopy={(e)=>{
        e.preventDefault()
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
                          Name
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-type">
                          Phone No
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-score">
                          Email
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          Joining date
                        </button>
                      </th>
                      <th>
                        <button
                          className="table-sort"
                          data-sort="sort-quantity"
                        >
                          Action
                        </button>
                      </th>
                    </tr>
                  </thead>
                  {filteredData.length == 0 ? (
                    <div>No data available</div>
                  ) : (
                    filteredData.map((item, index) => (
                      <tbody className="table-tbody">
                        <tr>
                          <td className="sort-name">{index + 1}</td>
                          <td className="sort-name">{item.ename}</td>
                          <td className="sort-city">{item.number}</td>
                          <td className="sort-type">{item.email}</td>
                          <td className="sort-type">{item.jdate}</td>
                          <td className="sort-score">
                            <IconButton
                              onClick={() => handleDeleteClick(item._id)}
                            >
                              <DeleteIcon>Delete</DeleteIcon>
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                functionopenpopup();
                                handleUpdateClick(item._id);
                              }}
                            >
                              <ModeEditIcon>Update</ModeEditIcon>
                            </IconButton>
                            <Link to={`/employees/${item._id}`}>
                            <IconButton 
                              >

                              <IconEye/>
                            </IconButton>
                            </Link>
                           
                          </td>
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
  );
}

export default Employees;