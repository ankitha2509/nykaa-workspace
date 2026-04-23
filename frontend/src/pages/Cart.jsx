import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      if (!userId) return;

      setLoading(true);

      const res = await fetch(
        `https://backend-1bfu.onrender.com/api/cart/${userId}`
      );

      const data = await res.json();
      setCartItems(data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const updateQuantity = async (id, qty, change) => {
    let newQty = qty + change;

    if (newQty < 1) newQty = 1;

    await fetch(
      `https://backend-1bfu.onrender.com/api/cart/update/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          quantity: newQty
        })
      }
    );

    fetchCart();
  };

  const removeItem = async (id) => {
    await fetch(
      `https://backend-1bfu.onrender.com/api/cart/delete/${id}`,
      {
        method: "DELETE"
      }
    );

    fetchCart();
  };

  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc + (item.productId?.price || 0) * item.quantity,
    0
  );

  if (loading) {
    return <h2 className="cart-loading">Loading Cart...</h2>;
  }

  return (
    <div className="cart-container">

      <h2 className="cart-title">My Bag</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h3>Your cart is empty</h3>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div className="cart-item" key={item._id}>

              <div className="cart-left">

                <img
                  src={item.productId?.image}
                  alt={item.productId?.name}
                />

                <div>
                  <h4>{item.productId?.name}</h4>
                  <p>{item.productId?.brand}</p>
                  <p className="price">
                    ₹{item.productId?.price}
                  </p>
                </div>

              </div>

              <div className="cart-right">

                <div className="qty-box">

                  <button
                    onClick={() =>
                      updateQuantity(
                        item._id,
                        item.quantity,
                        -1
                      )
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(
                        item._id,
                        item.quantity,
                        1
                      )
                    }
                  >
                    +
                  </button>

                </div>

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeItem(item._id)
                  }
                >
                  Remove
                </button>

              </div>

            </div>
          ))}

          <div className="cart-summary">

            <h3>Total: ₹{totalPrice}</h3>

            <button
              className="checkout-btn"
              onClick={() => navigate("/address")}
            >
              Proceed To Checkout
            </button>

          </div>
        </>
      )}

    </div>
  );
}

export default Cart;