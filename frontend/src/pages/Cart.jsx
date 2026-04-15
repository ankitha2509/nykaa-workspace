import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();


  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      if (!userId) return; 

      const res = await fetch(`https://backend-1bfu.onrender.com/api/cart/${userId}`);
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const updateQuantity = async (id, currentQty, change) => {
    let newQty = currentQty + change;

    if (newQty < 1) newQty = 1;

    await fetch(`https://backend-1bfu.onrender.com/api/cart/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: newQty }),
    });

    fetchCart();
  };

  const removeItem = async (id) => {
    await fetch(`https://backend-1bfu.onrender.com/api/cart/delete/${id}`, {
      method: "DELETE",
    });

    fetchCart();
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h2>Bag</h2>

      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div className="cart-item" key={item._id}>
              <div className="cart-left">
                <img src={`https://backend-1bfu.onrender.com/${item.productId?.image}`} />

                <div>
                  <h4>{item.productId?.name}</h4>
                  <p>{item.productId?.brand}</p>
                  <p>₹{item.productId?.price}</p>
                </div>
              </div>

              <div className="cart-right">
                <div className="qty-box">
                  <button onClick={() => updateQuantity(item._id, item.quantity, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity, 1)}>+</button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <h3 className="total">Total: ₹{totalPrice}</h3>

          <button
            className="address-btn"
            onClick={() => {
              console.log("Cart → Address");
              navigate("/address");
            }}
          >
            Proceed
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;