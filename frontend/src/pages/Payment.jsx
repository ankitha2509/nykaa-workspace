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

  useEffect(() => {
    const addr = JSON.parse(localStorage.getItem("selectedAddress"));
    setAddress(addr);

    fetch(`https://backend-1bfu.onrender.com/api/cart/${user._id}`)
      .then((res) => res.json())
      .then((data) => setCartItems(data));
  }, [user._id]);

  const total = cartItems.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (!address) {
      alert("Please select address");
      return;
    }

    const res = await fetch(
      `https://backend-1bfu.onrender.com/api/order/create/${user._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...address,
          paymentMethod: method,
        }),
      }
    );

    const data = await res.json();

    alert(data.message);
    navigate("/orders");
  };

  const handleCardPayment = async () => {
    if (!stripe || !elements) {
      alert("Stripe not loaded");
      return;
    }

    try {
      const res = await fetch(
        "https://backend-1bfu.onrender.com/api/payment/create-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: total }),
        }
      );

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
        placeOrder();
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="payment-page">

      <div className="payment-left">

        <h2>Select Payment Method</h2>

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
            Credit / Debit Card
          </div>

          <div
            className={`option ${method === "COD" ? "active" : ""}`}
            onClick={() => setMethod("COD")}
          >
            Cash On Delivery
          </div>

        </div>

        {method === "UPI" && (
          <div className="upi-box">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi-payment"
              alt="QR"
            />
            <p>Scan using GPay / PhonePe</p>
          </div>
        )}

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
          <h4>Deliver To</h4>
          {address && (
            <>
              <p>{address.name}</p>
              <p>{address.address1}</p>
              <p>{address.city} - {address.pincode}</p>
            </>
          )}
        </div>

        <div className="card">
          <h4>Bag Items ({cartItems.length})</h4>

          {cartItems.map((item) => (
            <div className="bag-item" key={item._id}>
              <img src={item.productId.image} alt="" />
              <span>{item.productId.name}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h4>Total</h4>
          <p>₹{total}</p>
        </div>

      </div>
    </div>
  );
}

export default Payment;