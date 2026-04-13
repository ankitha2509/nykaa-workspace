import { useEffect, useState } from "react";
import "./Orders.css";

function Orders() {

  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`http://localhost:5000/api/order/${user._id}`)
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div className="orders-container">

      <h2>My Orders</h2>

      {orders.map(order => (
        <div className="order-card" key={order._id}>

          <h4>Order ID: {order._id}</h4>
          <p>Status: {order.status}</p>
          <p>Payment: {order.paymentMethod}</p>

          <div>
            {order.items.map(item => (
              <p key={item._id}>
                {item.productId.name} × {item.quantity}
              </p>
            ))}
          </div>

          <h3>Total: ₹{order.totalAmount}</h3>

        </div>
      ))}

    </div>
  );
}

export default Orders;