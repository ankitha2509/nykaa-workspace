import { useEffect, useState } from "react";
import "./Address.css";

function Address() {

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    pincode: "",
  });

  const fetchAddresses = async () => {
    const res = await fetch(`https://backend-1bfu.onrender.com/api/address/${userId}`);
    const data = await res.json();
    setAddresses(data);
  };

  useEffect(() => {
    if (userId) fetchAddresses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveAddress = async () => {
    if (!form.name || !form.phone || !form.address1 || !form.city || !form.pincode) {
      alert("Please fill all required fields");
      return;
    }

    await fetch("https://backend-1bfu.onrender.com/api/address/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...form, userId }),
    });

    setForm({
      name: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      pincode: "",
    });

    fetchAddresses();
  };

  const selectAddress = (addr) => {
    localStorage.setItem("selectedAddress", JSON.stringify(addr));
    window.location.href = "/payment";
  };

  return (
    <div className="address-container">

      <h2>Choose Delivery Address</h2>

      <div className="saved-addresses">
        {addresses.length === 0 ? (
          <p>No saved addresses</p>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr._id}
              className="address-card"
              onClick={() => selectAddress(addr)}
            >
              <h4>{addr.name}</h4>
              <p>{addr.phone}</p>
              <p>{addr.address1}, {addr.address2}</p>
              <p>{addr.city} - {addr.pincode}</p>
            </div>
          ))
        )}
      </div>

      <div className="add-address-box">
        <h3>Add New Address</h3>

        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
        <input name="phone" placeholder="Mobile Number" value={form.phone} onChange={handleChange} />
        <input name="address1" placeholder="Address Line 1" value={form.address1} onChange={handleChange} />
        <input name="address2" placeholder="Address Line 2" value={form.address2} onChange={handleChange} />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
        <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />

        <button onClick={saveAddress}>Save Address</button>
      </div>

    </div>
  );
}

export default Address;