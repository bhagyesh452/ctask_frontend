import React, { useEffect, useState } from "react";
import axios from "axios";

function EmployeeLogin({ setnewToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/einfo");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const findUserId = () => {
    const user = data.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      setUserId(user._id);
    } else {
      setUserId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Trigger the findUserId function when email or password changes
  useEffect(() => {
    findUserId();
  }, [email, password]);

  console.log(userId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/employeelogin", {
        email,
        password,
      });

      const { newtoken } = response.data;
      setnewToken(newtoken);
      localStorage.setItem("newtoken", newtoken);
      localStorage.setItem("userId", userId);
      window.location.replace(`http://localhost:3002/employee-data/${userId}`);
    } catch (error) {
      console.error("Login failed:", error.message);
      setErrorMessage("Incorrect Credentials");
      // setErrorMessage("Incorrect Credentials!");
    }
  };

  return (
    <div>
      <div className="page page-center">
        <div className="container container-tight py-4">
          <div className="text-center mb-4">
            <a href="." className="navbar-brand navbar-brand-autodark">
              <img src="./static/logo.svg" height="36" alt="" />
            </a>
          </div>
          <div className="card card-md">
            <div className="card-body">
              <h2 className="h2 text-center mb-4">Employee Login</h2>
              <form action="#" method="get" autocomplete="off" novalidate>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    type="email"
                    className="form-control"
                    placeholder="Email or Phone Number"
                    autocomplete="off"
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">
                    Password
                    <span className="form-label-description">
                      <a href="./forgot-password.html">I forgot password</a>
                    </span>
                  </label>
                  <div className="input-group input-group-flat">
                    <input
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Your password"
                      autoComplete="off"
                    />
                    <span className="input-group-text">
                      <a
                        href="#"
                        className="link-secondary"
                        title="Show password"
                        data-bs-toggle="tooltip"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                          <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                        </svg>
                      </a>
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "center", color: "red" }}>
                  <span>{errorMessage}</span>
                </div>

                <div className="form-footer">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn btn-primary w-100"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeLogin;
