import { useState, useEffect } from "react";
import "./Payment.css";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

function Payment() {
  const [method, setMethod] = useState("UPI");
  const [address, setAddress] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const API = "https://backend-1bfu.onrender.com";

  useEffect(() => {
    const addr = JSON.parse(localStorage.getItem("selectedAddress"));
    setAddress(addr);

    fetch(`${API}/api/cart/${user._id}`)
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.log(err));
  }, [user._id]);

  const total = cartItems.reduce(
    (acc, item) =>
      acc + (item.productId?.price || 0) * item.quantity,
    0
  );

  const placeOrder = async () => {
    try {
      if (!address) {
        alert("Please select address");
        return;
      }

      const res = await fetch(`${API}/api/order/create/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...address,
          paymentMethod: method,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Order failed");
        return;
      }

      alert(data.message);

      setTimeout(() => {
        navigate("/orders");
      }, 300);
    } catch (err) {
      console.log(err);
      alert("Order error");
    }
  };

  const handleCardPayment = async () => {
    try {
      if (!stripe || !elements) {
        alert("Stripe not loaded");
        return;
      }

      const res = await fetch(`${API}/api/payment/create-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: total }),
      });

      const data = await res.json();

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: address?.name || "User",
          },
        },
      });

      if (result.error) {
        alert("Payment Failed");
      } else {
        alert("Payment Successful");
        await placeOrder();
      }
    } catch (err) {
      console.log(err);
      alert("Payment error");
    }
  };

  return (
    <div className="payment-page">

      <div className="payment-left">

        <h2>Payment</h2>
        <p className="subtitle">Choose your payment method</p>

        <div className="payment-options">

          <div
            className={`option ${method === "UPI" ? "active" : ""}`}
            onClick={() => setMethod("UPI")}
          >
            UPI Payment
          </div>

          <div
            className={`option ${method === "CARD" ? "active" : ""}`}
            onClick={() => setMethod("CARD")}
          >
            Card Payment
          </div>

          <div
            className={`option ${method === "COD" ? "active" : ""}`}
            onClick={() => setMethod("COD")}
          >
            Cash on Delivery
          </div>

        </div>

        {method === "CARD" && (
          <div className="card-box">
            <CardElement />
          </div>
        )}

        <button
          className="place-btn"
          onClick={() =>
            method === "CARD" ? handleCardPayment() : placeOrder()
          }
        >
          Place Order ₹{total}
        </button>

      </div>

      <div className="payment-right">

        <div className="card">
          <h4>Delivery Address</h4>

          {address ? (
            <>
              <p>{address.name}</p>
              <p>{address.street}</p>
              <p>{address.city}, {address.state}</p>
              <p>{address.pincode}</p>
              <p>{address.phone}</p>
            </>
          ) : (
            <p>No address selected</p>
          )}
        </div>

        <div className="card">
          <h4>Your Items</h4>

          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div className="bag-item" key={item._id}>
                <img
                  src={item.productId?.image}
                  alt="product"
                />

                <div style={{ flex: 1 }}>
                  <span>{item.productId?.name}</span>
                  <p className="qty">Qty: {item.quantity}</p>
                </div>

                <span>₹{item.productId?.price * item.quantity}</span>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h4>Price Details</h4>

          <div className="price-row">
            <p>Subtotal</p>
            <p>₹{total}</p>
          </div>

          <div className="price-row">
            <p>Delivery</p>
            <p className="free">FREE</p>
          </div>

          <hr />

          <div className="price-row total">
            <p>Total</p>
            <p>₹{total}</p>
          </div>

          <p className="secure-text">
            Secure payment powered by Stripe
          </p>
        </div>

      </div>

    </div>
  );
}

export default Payment;