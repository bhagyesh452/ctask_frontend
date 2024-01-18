import React, { useState, useEffect } from "react";
import axios from "axios";

function EmployeeTable({isUpdateMode}) {
  const [data, setData] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedDataId, setSelectedDataId] = useState(null);
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/einfo");

      // Set the retrieved data in the state
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const handleUpdateClick = (id) => {
    // Set the selected data ID and set update mode to true
    setSelectedDataId(id);
    setIsUpdateMode(true);

    // Find the selected data object
    const selectedData = data.find((item) => item._id === id);

    // Update the form data with the selected data values

    
  };
  useEffect(() => {
    // Fetch data from the Node.js server

    // Call the fetchData function
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      
      await axios.delete(`http://localhost:3001/einfo/${id}`);
      // Refresh the data after successful deletion
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <div>
      <div class="page-body">
        <div class="container-xl">
          <div class="card">
            <div class="card-body">
              <div id="table-default" class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>
                        <button class="table-sort" data-sort="sort-name">
                          Sr.No
                        </button>
                      </th>
                      <th>
                        <button class="table-sort" data-sort="sort-city">
                          Name
                        </button>
                      </th>
                      <th>
                        <button class="table-sort" data-sort="sort-type">
                          Phone No
                        </button>
                      </th>
                      <th>
                        <button class="table-sort" data-sort="sort-score">
                          Email
                        </button>
                      </th>
                      <th>
                        <button class="table-sort" data-sort="sort-date">
                          Joining date
                        </button>
                      </th>
                      <th>
                        <button class="table-sort" data-sort="sort-quantity">
                          Action
                        </button>
                      </th>
                    </tr>
                  </thead>
                  {data.length == 0 ? (
                    <div>No data available</div>
                  ) : (
                    data.map((item, index) => (
                      <tbody class="table-tbody">
                        <tr>
                          <td class="sort-name">{index +1}</td>
                          <td class="sort-name">{item.ename}</td>
                          <td class="sort-city">{item.number}</td>
                          <td class="sort-type">{item.email}</td>
                          <td class="sort-type">date</td>
                          <td class="sort-score">
                          <button onClick={() => handleDelete(item._id)}>Delete</button>
            <button onClick={() => { functionopenpopup()
              handleUpdateClick(item._id)}
            } >Update</button>
                          </td>
                        </tr>
                      </tbody>
                    ))
                  )}
                  <tbody class="table-tbody"></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeTable;
