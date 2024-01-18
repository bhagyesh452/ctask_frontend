import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import axios from "axios";
import { IconChevronLeft } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import { IconEye } from "@tabler/icons-react";
import { useRef, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "react-modal";
import { json } from "react-router-dom";

function Leads() {
  const [open, openchange] = useState(false);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
  const [openNew, openchangeNew] = useState(false);
  const [openEmp, openchangeEmp] = useState(false);
  const [openConf, openChangeConf] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [csvdata, setCsvData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [citySearch, setcitySearch] = useState("");
  const [selectedField, setSelectedField] = useState("Company Name");
  const [employeeSelection, setEmployeeSelection] = useState("Select Employee");
  const [newempData, setnewEmpData] = useState([]);
  // const [currentData, setCurrentData] = useState([]);

  const [newDate, setNewDate] = useState([null]);

  // Manual Data
  const [cname, setCname] = useState("");
  const [cemail, setCemail] = useState("");
  const [cnumber, setCnumber] = useState(0);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [cidate, setCidate] = useState(null);
  const itemsPerPage = 10;
  const [visibility, setVisibility] = useState("none");
  const [visibilityOther, setVisibilityOther] = useState("block");
  const [subFilterValue, setSubFilterValue] = useState("");

  //fetch data
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/leads");

      // Set the retrieved data in the state

      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    // Fetch data from the Node.js server
    // Call the fetchData function
    fetchData();
    fetchnewData();
  }, []);
  // const fileInputRef = useRef(null);
  const functionopenpopup = () => {
    openchange(true);
    setCsvData([]);
  };
  const functionopenpopupEmp = () => {
    openchangeEmp(true);
  };
  const handleFieldChange = (event) => {
    if (event.target.value === "Company Incorporation Date  ") {
      setSelectedField(event.target.value);
      setVisibility("block");
      setVisibilityOther("none");
      setSubFilterValue("");
    } else {
      setSelectedField(event.target.value);
      setVisibility("none");
      setVisibilityOther("block");
      setSubFilterValue("");
    }

    console.log(selectedField);
  };
  const functionopenpopupNew = () => {
    openchangeNew(true);
  };
  const functionopenpopupConf = () => {
    openChangeConf(true);
  };
  const closepopup = () => {
    openchange(false);

    setCsvData([]);
  };
  const closepopupNew = () => {
    openchangeNew(false);
    fetchData();
  };
  const closepopupEmp = () => {
    openchangeEmp(false);
    fetchData();
  };
  const closepopupConf = () => {
    openChangeConf(false);
    fetchData();
  };

  const handleImportClick = () => {
    // fileInputRef.current.click();
    functionopenpopup();
  };
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // -------------------- SEARCH BAR-------------------------

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter the data based on the search query (case-insensitive partial match)
    const filtered = "ahmedabad";
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

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredData = data.filter((company) => {
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
        return true;
      } else if (year == 0) {
        return true;
      }
      const selectedDate = new Date(fieldValue);
      const selectedMonth = selectedDate.getMonth() + 1; // Months are 0-indexed
      const selectedYear = selectedDate.getFullYear();
      console.log(month);
      console.log(year);
      // console.log(selectedMonth);
      //

      // Use the provided month variable in the comparison
      return (
        selectedMonth.toString().includes(month) &&
        selectedYear.toString().includes(year)
      );
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

  //  Sub-filter value

  const handleSubFilterChange = (event) => {
    setSubFilterValue(event.target.value);
  };

  // const parseCsvData = (csvString) => {

  //   const rows = csvString.split('\n');
  //   const header = rows[0].split(',');
  //   const data = [];

  //   for (let i = 1; i < rows.length; i++) {
  //     const values = rows[i].split(',');
  //     const rowData = {};

  //     for (let j = 0; j < header.length; j++) {
  //       rowData[header[j]] = values[j];
  //     }

  //     data.push(rowData);
  //   }

  //   return data;
  // };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming there's only one sheet in the XLSX file
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setCsvData(jsonData);
      };

      reader.readAsArrayBuffer(file);
    } else {
      console.error("Please upload a valid XLSX file.");
    }
  };

  const handleUploadData = async (e) => {
    if (csvdata.length !== 0) {
      try {
        await axios.post("http://localhost:3001/api/leads", csvdata);
        console.log("Data sent successfully");
        fetchData();
      } catch (error) {
        if (error.response.status !== 500) {
          setErrorMessage(error.response.data.error);
          alert("Some of the data are not unique");
        } else {
          setErrorMessage("An error occurred. Please try again.");
          alert("Please upload unique data");
        }
        console.log("Error:", error);
      }
      setCsvData([]);
    } else {
      alert("Please upload data");
    }
  };
  // const handleUploadClick = () => {
  //   fileInputRef.current.click();
  // };

  // to delete the data
  const [itemIdToDelete, setItemIdToDelete] = useState(null);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/leads/${id}`);
      // Refresh the data after successful deletion
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

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

  // Submit the Dialogue box data manually

  const handleSubmitData = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:3001/api/manual`, {
        "Company Name": cname,
        "Company Number": cnumber,
        "Company Email": cemail,
        "Company Incorporation Date  ": cidate,
        City: city,
        State: state,
        AssignDate: new Date(),
      })
      .then((response) => {
        console.log("Data sent Successfully");
        fetchData();
        closepopupNew();
      })
      .catch((error) => {
        alert("Please Enter Unique data!");
      });
  };

  // ------------------------------------------- CHECK BOX CONTENT----------------------------------------------------

  const [selectedRows, setSelectedRows] = useState([]);

  const handleCheckboxChange = (id) => {
    // Toggle the selection status of the row with the given id
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    });
  };

  const handlePrintSelectedData = () => {
    // Print the data of the selected rows

    const selectedData = data.filter((row) => selectedRows.includes(row._id));
    console.log("Selected Data:", selectedData);
  };

  // Fetch Employees Data

  const fetchnewData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/einfo");

      // Set the retrieved data in the state

      setnewEmpData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleconfirmAssign = async () => {
    const selectedObjects = data.filter((row) =>
      selectedRows.includes(row._id)
    );
    console.log(selectedObjects, employeeSelection);
    for (const obj of selectedObjects) {
      if (!obj.ename) {
        handleAssignData();
      } else {
        // If ename is present, show a confirmation dialog
        const userConfirmed = window.confirm(
          `Data is already assigned to: ${obj.ename}. Do you want to continue?`
        );

        if (userConfirmed) {
          // If user confirms, perform the assignation
          handleAssignData();
        } else {
          // If user cancels, you can handle it as needed (e.g., show a message)
          console.log("User canceled the assignation.");
        }
      }
    }
  };

  const handleAssignData = async () => {
    // // Find the selected employee object
    const selectedObjects = data.filter((row) =>
      selectedRows.includes(row._id)
    );
    // console.log(selectedObjects, employeeSelection);

    try {
      const response = await axios.post("http://localhost:3001/api/postData", {
        employeeSelection,
        selectedObjects,
      });
      window.location.reload();
      console.log("Data posted successfully");
    } catch (err) {
      console.log("Internal server Error", err);
    }

    // const selectedempData = selectedRows.find(
    //   (employee) => employee.ename === employeeSelection
    // );
    // const selectedData = data.filter((row) => selectedRows.includes(row._id));

    // Check if an employee is selected
    // if (!selectedEmployee) {
    //   console.warn("No employee selected");
    //   return;
    // }

    // try {
    //   // Map the selected data to the format expected by the backend
    //   const formattedSelectedData = selectedData.map((row) => ({
    //     "Company Name": row["Company Name"],
    //     "Company Number": row["Company Number"],
    //     "Company Email": row["Company Email"],
    //     "Company Incorporation Date  ": row["Company Incorporation Date  "],
    //     City: row.City,
    //     State: row.State,
    //   }));

    //   // Check for duplicates in company names or numbers
    //   const existingCompanyNames = new Set();
    //   const existingCompanyNumbers = new Set();

    //   formattedSelectedData.forEach((row) => {
    //     if (existingCompanyNames.has(row["Company Name"]) || existingCompanyNumbers.has(row["Company Number"])) {
    //       // Duplicate found, perform your action
    //       functionopenpopupConf();
    //       console.log("Duplicate data found");
    //       return;
    //     }

    //   });

    //   // Make a PUT request using Axios to update the value on the backend
    //   const response = await axios.put(
    //     `http://localhost:3001/neweinfo/${selectedEmployee._id}`,
    //     {
    //       cInfo: formattedSelectedData,
    //     }
    //   );

    //   if (response.status === 200) {
    //     const updatedData = response.data.updatedData;
    //     console.log(`Value assigned to ${updatedData._id}`);
    //     window.location.reload();

    //     // Optionally, you can update the state or trigger a re-fetch of the data
    //     // based on your application's requirements.
    //   } else {
    //     console.error("Error updating data:", response.statusText);
    //     alert("Data Already exist");
    //   }
    // } catch (error) {
    //   functionopenpopupConf();

    //   console.error("Error updating data:", error.message);
    // }
  };

  // const handleAssignData = async () => {
  //   // Find the selected employee object

  //   const selectedEmployee = newempData.find(
  //     (employee) => employee.ename === employeeSelection
  //   );
  //   const selectedData = data.filter((row) => selectedRows.includes(row._id));

  //   // Check if an employee is selected
  //   if (!selectedEmployee) {
  //     console.warn("No employee selected");
  //     return;
  //   }

  //   try {
  //     // Map the selected data to the format expected by the backend
  //     const formattedSelectedData = selectedData.map((row) => ({
  //       "Company Name": row["Company Name"],
  //       "Company Number": row["Company Number"],
  //       "Company Email": row["Company Email"],
  //       "Company Incorporation Date  ": row["Company Incorporation Date  "],
  //       City: row.City,
  //       State: row.State,
  //     }));

  //     // Make a PUT request using Axios to update the value on the backend
  //     const response = await axios.put(
  //       `http://localhost:3001/neweinfo/${selectedEmployee._id}`,
  //       {
  //         cInfo: formattedSelectedData,
  //       }
  //     );

  //     if (response.status === 200) {
  //       const updatedData = response.data.updatedData;
  //       console.log(`Value assigned to ${updatedData._id}`);
  //       window.location.reload();

  //       // Optionally, you can update the state or trigger a re-fetch of the data
  //       // based on your application's requirements.
  //     } else {
  //       console.error("Error updating data:", response.statusText);
  //       alert("Data Already exist");
  //     }
  //   } catch (error) {
  //     functionopenpopupConf();
  //     console.error("Error updating data:", error.message);
  //   }
  // };

  // delete selection

  const handleDeleteSelection = async () => {
    try {
      await axios.delete("http://localhost:3001/api/delete-rows", {
        data: { selectedRows }, // Pass selected rows to the server
      });
      // After deletion, fetch updated data
      fetchData();
      setSelectedRows([]); // Clear selectedRows state
    } catch (error) {
      console.error("Error deleting rows:", error.message);
    }
  };

  return (
    <div>
      <Header />
      <Navbar />
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
      {/* <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
        <DialogTitle>
          Upload Files{" "}
          <IconButton onClick={closepopup} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>

        <DialogContent>
          <input
            type="file"
            style={{ display: "none" }}
            multiple
            // onChange={handleFileChange}
          />

          <div
            style={{
              border: "2px dashed #ccc",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                border: "2px dashed #ccc",
                borderRadius: "50%",
                width: "100px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
              }}
              // onClick={handleUploadClick}
            >
              <span style={{ fontSize: "24px", cursor: "pointer" }}>+</span>
            </div>
            <p>Drag files here or click to browse</p>
          </div>

          <div style={{display:"flex" , justifyContent:"space-between"}} className="footer">
            <Button onClick={closepopup}>Cancel</Button>
            <button  className="btn btn-primary d-none d-sm-inline-block">
        
              
              Upload
            </button>
          </div>
        </DialogContent>
      </Dialog> */}

      {/* Dialog for Confirmation of Assignment */}

      <Dialog open={openConf} onClose={closepopupConf}>
        <DialogTitle>
          Confirm Assignation!
          <IconButton onClick={closepopupConf} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>

        <DialogContent>
          <div className="alertdiv">
            <h3>
              This Data is already assigned to name, are you sure you want to
              continue?
            </h3>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            className="maincontent"
          >
            <button className="btn btn-primary ms-auto">Yes</button>

            <Button>No</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogue for Assign Leads */}
      <Dialog open={openEmp} onClose={closepopupEmp} fullWidth maxWidth="sm">
        <DialogTitle>
          Assign Data{" "}
          <IconButton onClick={closepopupEmp} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="form-control">
            {newempData.length !== 0 ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  className="dialogAssign"
                >
                  <div className="selector">
                    <select
                      style={{ padding: "5px" }}
                      value={employeeSelection}
                      onChange={(e) => {
                        setEmployeeSelection(e.target.value);
                      }}
                    >
                      <option value="Select Employee" disabled>
                        Select employee
                      </option>
                      {newempData.map((item) => (
                        <option value={item.ename}>{item.ename}</option>
                      ))}
                    </select>
                  </div>
                  <div className="btn-list">
                    <button
                      onClick={handleconfirmAssign}
                      className="btn btn-primary ms-auto"
                    >
                      Assign Data
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <h1>No Employees Found</h1>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for ADD leads */}

      <Dialog open={openNew} onClose={closepopupNew} fullWidth maxWidth="sm">
        <DialogTitle>
          Company Info{" "}
          <IconButton onClick={closepopupNew} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="example-text-input"
                    placeholder="Your Company Name"
                    onChange={(e) => {
                      setCname(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Company Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="example-text-input"
                    placeholder="example@gmail.com"
                    onChange={(e) => {
                      setCemail(e.target.value);
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Company Number</label>
                      <input
                        type="number"
                        onChange={(e) => {
                          setCnumber(e.target.value);
                        }}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Company Incorporation Date
                      </label>
                      <input
                        onChange={(e) => {
                          setCidate(e.target.value);
                        }}
                        type="date"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">City</label>
                      <input
                        onChange={(e) => {
                          setCity(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">State</label>
                      <input
                        onChange={(e) => {
                          setState(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              className="btn btn-link link-secondary"
              onClick={closepopupNew}
            >
              Cancel
            </button>
            <Button onClick={handleSubmitData} variant="contained">
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ----------------------------ADD-Lead Ends here------------------------------------------------------------------------  */}

      {open && (
        <div>
          <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
            <DialogTitle>
              Upload Files{" "}
              <IconButton onClick={closepopup} style={{ float: "right" }}>
                <CloseIcon color="primary"></CloseIcon>
              </IconButton>{" "}
            </DialogTitle>
            <DialogContent>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button onClick={handleButtonClick}>Choose File</button>
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
                className="footer"
              >
                <Button onClick={closepopup}>Cancel</Button>
                <button
                  onClick={handleUploadData}
                  className="btn btn-primary d-none d-sm-inline-block"
                >
                  Upload
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
      {/* Main Page Starts from here */}
      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                {/* <!-- Page pre-title --> */}
                <h2 className="page-title">Leads</h2>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="features"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
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
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="feature2"
                >
                  <div style={{ margin: "0px 10px" }} className="addLeads">
                    <div className="btn-list">
                      <button
                        onClick={handleDeleteSelection}
                        className="btn btn-primary d-none d-sm-inline-block"
                      >
                        Delete Selection
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
                  <div style={{ margin: "0px 10px" }} className="addLeads">
                    <div className="btn-list">
                      <button
                        onClick={functionopenpopupEmp}
                        className="btn btn-primary d-none d-sm-inline-block"
                      >
                        AssignLeads
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
                  <div style={{ margin: "0px 10px" }} className="addLeads">
                    <div className="btn-list">
                      <button
                        onClick={functionopenpopupNew}
                        className="btn btn-primary d-none d-sm-inline-block"
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
                        Add Leads
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
                  <div className="importCSV">
                    <div className="btn-list">
                      <button
                        onClick={handleImportClick}
                        className="btn btn-primary d-none d-sm-inline-block"
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
                        Import CSV
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
                <div style={{ width: "fit-content" }} className="input-icon">
                  <hr style={{ margin: "10px" }} />
                  <div style={{ display: "flex" }} className="mb-0">
                    <div className="form-control">
                      <select
                        style={{ border: "none", outline: "none" }}
                        onChange={(e) => {
                          setMonth(e.target.value);
                        }}
                      >
                        <option value="" disabled selected>
                          Select Month
                        </option>
                        <option value="12">12</option>
                        <option value="11">11</option>
                        <option value="10">10</option>
                        <option value="9">9</option>
                        <option value="8">8</option>
                        <option value="7">7</option>
                        <option value="6">6</option>
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
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
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
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
          </div>
        </div>
      </div>

      {/* table body */}
      <div className="page-body">
        <div className="container-xl">
          <div className="card">
            <div className="card-body">
              <div id="table-default" className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>
                        <button className="table-sort" data-sort="sort-name">
                          Select
                        </button>
                      </th>
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
                          Company Inco. Date
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
                        <button
                          className="table-sort"
                          data-sort="sort-quantity"
                        >
                          Last Updated on:
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
                  {currentData.length == 0 ? (
                    <div>
                      <h2 style={{ textAlign: "center" }}>
                        {" "}
                        No data available
                      </h2>
                    </div>
                  ) : (
                    currentData.map((company, index) => (
                      <tbody className="table-tbody">
                        <tr>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(company._id)}
                              onChange={() => handleCheckboxChange(company._id)}
                            />
                          </td>
                          <td className="sort-name">
                            {startIndex + index + 1}
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
                            {
                              new Date(company["Company Incorporation Date  "])
                                .toISOString()
                                .split("T")[0]
                            }
                          </td>
                          <td className="sort-name">{company["City"]}</td>
                          <td className="sort-name">{company["State"]}</td>
                          <td className="sort-name">{company["Status"]}</td>
                          <td className="sort-name">{company["AssignDate"]}</td>
                          <td className="sort-name">
                            <IconButton
                              onClick={() => handleDeleteClick(company._id)}
                            >
                              <DeleteIcon>Delete</DeleteIcon>
                            </IconButton>
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
                className="pagination">
              
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
                  {Math.ceil(data.length / itemsPerPage)}
                </span>

                <IconButton
                  onClick={() =>
                    setCurrentPage((prevPage) =>
                      Math.min(
                        prevPage + 1,
                        Math.ceil(data.length / itemsPerPage) - 1
                      )
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(data.length / itemsPerPage) - 1
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
  );
}

export default Leads;
