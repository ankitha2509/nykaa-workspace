import { useEffect, useState } from "react";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?._id) return;

    fetch(`https://backend-1bfu.onrender.com/api/order/${user._id}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.log("Orders fetch error:", err));

  }, [user?._id]);

  return (
    <div className="orders-container">

      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>

            <h4>Order ID: {order._id}</h4>

            <p>
              Status: {order.status ? order.status : "Processing"}
            </p>

            <p>Payment: {order.paymentMethod}</p>

            <div>
              {order.items?.map((item) => (
                <p key={item._id}>
                  {item.productId?.name} × {item.quantity}
                </p>
              ))}
            </div>

            <h3>Total: ₹{order.totalAmount}</h3>

          </div>
        ))
      )}

    </div>
  );
}

export default Orders;