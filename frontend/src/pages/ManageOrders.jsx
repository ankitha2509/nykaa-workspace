import { useEffect, useState } from "react";
import "./ManageOrders.css";

function ManageOrders() {

  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    fetch("https://backend-1bfu.onrender.com/api/admin/orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(
      `https://backend-1bfu.onrender.com/api/admin/orders/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    fetchOrders();
  };

  return (
    <div className="manage-page">

      <h2>All Orders ({orders.length})</h2>

      {orders.map(order => (
        <div className="order-card" key={order._id}>

          <h3>{order.name}</h3>
          <p>{order.address}</p>
          <p>₹{order.totalAmount}</p>
          <p>{order.paymentMethod}</p>

          <select
            value={order.status || "Pending"}
            onChange={(e) =>
              updateStatus(order._id, e.target.value)
            }
          >
            <option>Pending</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>

        </div>
      ))}

    </div>
  );
}

export default ManageOrders;