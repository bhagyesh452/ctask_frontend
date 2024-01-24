import React, { useEffect } from "react";
import Header from "./Header";
import { useState } from "react";
import { useParams } from "react-router-dom";
import EmpNav from "../employeeComp/EmpNav";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import Swal from "sweetalert2";
import { IconButton } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

function ConveertedLeads() {
  const [data, setData] = useState([]);

  const { userId } = useParams();
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

  useEffect(() => {
    fetchData();
  }, [userId]);
  console.log(data);

  const [open, openchange] = useState(false);
  const functionopenpopup = () => {
    openchange(true);
  };
  const closepopup = () => {
    openchange(false);
  };

  return (
    <div>
      {/* Dialog box Content */}

      <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
        <div class="col-md-12">
          <form class="card">
            <div class="card-header">
              <h3 class="card-title">Basic form</h3>
              <IconButton onClick={closepopup} style={{ float: "right" }}>
                <CloseIcon color="primary"></CloseIcon>
              </IconButton>{" "}
            </div>
            <div class="card-body">
              <div className="BDM-Name">
                <label class="form-label">BDM Name</label>
                <div className="nameSection d-flex">
                  <div className="name">
                    <div className="choose-option">
                      <select
                        type="text"
                        class="form-select"
                        id="select-users"
                        value=""
                      >
                        <option value="1">Chuck Tesla</option>
                        <option value="2">Elon Musk</option>
                        <option value="3">Paweł Kuna</option>
                        <option value="4">Nikola Tesla</option>
                        <option value="5">Other</option>
                      </select>
                    </div>
                    <div className="closeby">
                      <div class="mb-3">
                        <div>
                          <label class="form-check form-check-inline">
                            <input
                              class="form-check-input"
                              type="radio"
                              name="radios-inline"
                              checked
                            />
                            <span class="form-check-label">Close By</span>
                          </label>
                          <label class="form-check form-check-inline">
                            <input
                              class="form-check-input"
                              type="radio"
                              name="radios-inline"
                            />
                            <span class="form-check-label">Supported By</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="othername">
                    <input
                      type="text"
                      name="othername"
                      id="othername"
                      placeholder="Enter BDE Name"
                      className="form-control"
                    />
                  </div>
                  <div className="email">
                    <select
                      type="text"
                      class="form-select"
                      id="select-emails"
                      value=""
                    >
                      <option value="1">Chuck Tesla</option>
                      <option value="2">Elon Musk</option>
                      <option value="3">Paweł Kuna</option>
                      <option value="4">Nikola Tesla</option>
                      <option value="5">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="booking-date">
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label className="form-label">Booking Date</label>
                    <input type="date" className="form-control" />
                  </div>
                </div>
              </div>
              <div className="CA-case">
                <label class="form-label">CA Case</label>
                <div className="check-ca-case">
                  <div class="mb-3">
                    <div>
                      <label class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="radios-inline"
                          checked
                        />
                        <span class="form-check-label">Yes</span>
                      </label>
                      <label class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="radios-inline"
                        />
                        <span class="form-check-label">No</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="nameSection d-flex">
                  <div className="othername">
                    <input
                      type="text"
                      name="othername"
                      id="othername"
                      placeholder="Enter CA's Name"
                      className="form-control"
                    />
                  </div>
                  <div className="closeby">
                    <div className="othername">
                      <input
                        type="text"
                        name="othername"
                        id="othername"
                        placeholder="Enter CA's Email Address"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="othername">
                    <input
                      type="text"
                      name="othername"
                      id="othername"
                      placeholder="Enter CA's Commision- If any"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="company-name">
                <label class="form-label">
                  Enter Company's Name
                </label>
                <input
                  type="text"
                  name="othername"
                  id="othername"
                  placeholder="Enter Company Name"
                  className="form-control"
                />
              </div>
              <div className="company-contact">
                <label class="form-label">
                  Enter Contact Number
                </label>
                <input
                  type="text"
                  name="othername"
                  id="othername"
                  placeholder="Enter Contact Number"
                  className="form-control"
                />
              </div>
              <div className="company-email">
                <label class="form-label">
                  Enter Company's Email-ID
                </label>
                <input
                  type="text"
                  name="othername"
                  id="othername"
                  placeholder="Enter Company Email ID"
                  className="form-control"
                />
              </div>
              <div className="services">
                <label class="form-label">
                  Servies
                </label>
                <input
                  type="text"
                  name="othername"
                  id="othername"
                  placeholder="Enter Servies Name"
                  className="form-control"
                />
              </div>
              {/* <div className="payment">
                <label class="form-label">
                  Total Payment
                </label>
                <input
                  type="text"
                  name="othername"
                  id="othername"
                  placeholder="Enter Total "
                  className="form-control"
                />
              </div> */}
            </div>
            <div class="card-footer text-end">
              <button type="submit" class="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </Dialog>

      <Header name={data.ename} designation={data.designation} />
      <EmpNav userId={userId} />
      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div
            style={{ justifyContent: "space-between" }}
            className="container-xl d-flex"
          >
            <div className="row g-2 align-items-center">
              <div className="col">
                {/* <!-- Page pre-title --> */}
                <h2 className="page-title">Converted leads</h2>
              </div>
            </div>
            <div className="request">
              <div className="btn-list">
                <button
                  onClick={functionopenpopup}
                  className="btn btn-primary d-none d-sm-inline-block"
                >
                  ADD person
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
  );
}

export default ConveertedLeads;
