import { useEffect, useState } from "react";
import "./ManageUsers.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://backend-1bfu.onrender.com/api/admin/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div className="manage-page">

      <h2>All Users ({users.length})</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name || "No Name"}</td>
              <td>{user.email || "-"}</td>
              <td>{user.mobile || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default ManageUsers;