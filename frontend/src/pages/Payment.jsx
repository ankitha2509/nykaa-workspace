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
      .then((data) => setCartItems(data));
  }, [user._id]);

  const total = cartItems.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  // ✅ PLACE ORDER
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

      // ✅ IMPORTANT: delay gives backend time to respond cleanly
      setTimeout(() => {
        navigate("/orders");
      }, 300);

    } catch (err) {
      console.log(err);
      alert("Order error");
    }
  };

  // ✅ STRIPE PAYMENT
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

        <h2>Select Payment Method</h2>

        <div className="payment-options">

          <div className={`option ${method === "UPI" ? "active" : ""}`}
            onClick={() => setMethod("UPI")}>
            UPI Payment
          </div>

          <div className={`option ${method === "CARD" ? "active" : ""}`}
            onClick={() => setMethod("CARD")}>
            Card
          </div>

          <div className={`option ${method === "COD" ? "active" : ""}`}
            onClick={() => setMethod("COD")}>
            COD
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

    </div>
  );
}

export default Payment;