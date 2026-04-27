import { useEffect, useState } from "react";
import "./ManageOrders.css";

function ManageOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    fetch("https://backend-1bfu.onrender.com/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
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
    <div className="manage-orders-page">

      <div className="top-bar">
        <h2>Manage Orders</h2>
        <span>{orders.length} Orders</span>
      </div>

      {orders.map((order) => (
        <div className="order-card" key={order._id}>

          <div className="order-header">
            <div>
              <h3>{order.name}</h3>
              <p>{order.address}</p>
            </div>

            <div className={`status-badge ${order.status?.toLowerCase()}`}>
              {order.status || "Pending"}
            </div>
          </div>

          <div className="order-details">
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            <p><strong>Payment:</strong> {order.paymentMethod}</p>
          </div>

         <div className="product-section">
  <h4>Products</h4>

  {order.items?.map((item, index) => (
    <div className="product-row" key={index}>

      <img
        src={item.productId?.image}
        alt=""
      />

      <div>
        <p>{item.productId?.name}</p>
        <span>Qty: {item.quantity}</span>
      </div>

      <b>₹{item.productId?.price}</b>

    </div>
  ))}
</div>

          <div className="status-section">
            <select
              value={order.status || "Pending"}
              onChange={(e) =>
                updateStatus(order._id, e.target.value)
              }
            >
              <option>Pending</option>
              <option>Placed</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </div>

        </div>
      ))}

    </div>
  );
}

export default ManageOrders;