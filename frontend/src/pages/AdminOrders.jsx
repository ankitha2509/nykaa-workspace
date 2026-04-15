import { useEffect, useState } from "react";
import "./AdminOrders.css";

function AdminOrders() {

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch("https://backend-1bfu.onrender.com/api/order/admin/all");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await fetch(`https://backend-1bfu.onrender.com/api/order/update-status/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    fetchOrders();
  };

  return (
    <div className="admin-orders-container">

      <h2>Manage Orders</h2>

      {orders.length === 0 ? (
        <p>No Orders Found</p>
      ) : (
        orders.map((order) => (
          <div className="admin-order-card" key={order._id}>

            <div className="order-header">
              <h4>Order ID: {order._id}</h4>
              <select
                value={order.status}
                onChange={(e) =>
                  handleStatusChange(order._id, e.target.value)
                }
              >
                <option>Placed</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
              </select>
            </div>

            <div className="customer-info">
              <p><b>Name:</b> {order.name}</p>
              <p><b>Phone:</b> {order.phone}</p>
              <p><b>Address:</b> {order.address}</p>
            </div>


            <div className="items">
              {order.items.map((item, index) => (
                <div key={index} className="item">

                  <img
                    src={`https://backend-1bfu.onrender.com/${item.productId.image}`}
                    alt=""
                  />

                  <div>
                    <p>{item.productId.name}</p>
                    <p>₹{item.productId.price}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>

                </div>
              ))}
            </div>

            <h3>Total: ₹{order.totalAmount}</h3>

          </div>
        ))
      )}
      
    </div>
  );
}

export default AdminOrders; 