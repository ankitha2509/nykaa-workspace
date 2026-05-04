import { useEffect, useState } from "react";
import "./ManageOrders.css";

function ManageOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("https://backend-1bfu.onrender.com/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.log(err));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(
        `https://backend-1bfu.onrender.com/api/admin/orders/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status })
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getColor = (status) => {
    if (status === "Processing") return "orange";
    if (status === "Packed") return "#8e44ad";
    if (status === "Shipped") return "#3498db";
    if (status === "Delivered") return "green";
    if (status === "Cancelled") return "red";
    return "gray";
  };

  return (
    <div className="manage-page">
      <h2>All Orders ({orders.length})</h2>

      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-row">

            <img
              src={
                order.image ||
                order.productImage ||
                order.product?.image ||
                "https://via.placeholder.com/70"
              }
              alt="product"
            />

            <div className="order-info">
              <h4>
                {order.name ||
                  order.productName ||
                  order.product?.name ||
                  "Product"}
              </h4>

              <p>
                ₹
                {order.price ||
                  order.productPrice ||
                  order.product?.price ||
                  0}
              </p>

              <p>
                Customer:{" "}
                {order.userName ||
                  order.user?.name ||
                  order.name ||
                  "User"}
              </p>

              <p>
                Email:{" "}
                {order.email ||
                  order.user?.email ||
                  "-"}
              </p>

              <p>
                Qty: {order.quantity || 1}
              </p>
            </div>
          </div>

          <select
            value={order.status || "Processing"}
            onChange={(e) =>
              updateStatus(order._id, e.target.value)
            }
            style={{
              backgroundColor: getColor(
                order.status || "Processing"
              )
            }}
          >
            <option value="Processing">
              Processing
            </option>
            <option value="Packed">
              Packed
            </option>
            <option value="Shipped">
              Shipped
            </option>
            <option value="Delivered">
              Delivered
            </option>
            <option value="Cancelled">
              Cancelled
            </option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default ManageOrders;