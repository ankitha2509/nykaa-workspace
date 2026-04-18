import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://backend-1bfu.onrender.com/api/product/${id}`
        );

        const data = await res.json();
        setProduct(data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchProduct();
  }, [id]);

  // ===============================
  // ADD TO CART
  // ===============================
  const handleAddToCart = async () => {
    try {
      if (!userId) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      const res = await fetch(
        "https://backend-1bfu.onrender.com/api/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: userId,
            productId: product._id,
            quantity: 1
          })
        }
      );

      const data = await res.json();

      alert(data.message);

      navigate("/cart");

    } catch (error) {
      console.log(error);
      alert("Error adding to cart");
    }
  };

  if (!product) return <h2 className="loading">Loading...</h2>;

  return (
    <div className="product-page">

      {/* LEFT IMAGE */}
      <div className="product-left">
        <img src={product.image} alt={product.name} />
      </div>

      {/* RIGHT INFO */}
      <div className="product-right">

        <h1>{product.name}</h1>
        <p className="brand">{product.brand}</p>

        <h2 className="price">₹{product.price}</h2>

        <p className="desc">{product.description}</p>

        <div className="btn-group">

          <button
            className="cart-btn"
            onClick={handleAddToCart}
          >
            Add To Cart
          </button>

          <button className="wishlist-btn">
            Wishlist
          </button>

        </div>

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Go Back
        </button>

      </div>

    </div>
  );
}

export default ProductDetails;