import { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/user/${userId}`);
        const data = await res.json();

        setForm({
          name: data.name || "",
          phone: data.phone || data.mobile || "",
          email: data.email || "",
          gender: data.gender || "",
        });

      } catch (err) {
        console.log(err);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  const handleSave = async () => {
    try {
      await fetch(`http://localhost:5000/api/auth/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      alert("Profile Saved");

    } catch (err) {
      console.log(err);
      alert("Error saving profile");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">

        <h2 className="profile-title">My Profile</h2>

        <div className="profile-grid">

          <div className="profile-group">
            <label>Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="profile-group">
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="profile-group">
            <label>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled
            />
          </div>

          <div className="profile-group">
            <label>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

        </div>

        <button className="save-btn" onClick={handleSave}>
          Save Details
        </button>

      </div>
    </div>
  );
}

export default Profile;