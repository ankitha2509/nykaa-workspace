import { useEffect, useState } from "react";
import "./ManageUsers.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://backend-1bfu.onrender.com/api/admin/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="manage-page">

      <h2>All Users ({users.length})</h2>

      {users.map(user => (
        <div className="user-card" key={user._id}>

          <div className="user-left">
            <div className="avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3>{user.name || "No Name"}</h3>
              <p>{user.email}</p>
              <span>{user.mobile}</span>
            </div>
          </div>

          <div className="user-right">
            <span className="badge">Active</span>
          </div>

        </div>
      ))}

    </div>
  );
}

export default ManageUsers;