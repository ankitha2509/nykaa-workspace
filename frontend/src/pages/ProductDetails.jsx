import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  if (!product) return <h2 className="loading">Loading...</h2>;

  return (
    <div className="product-page">

      <div className="product-card">

        {/* LEFT SIDE IMAGE */}
        <div className="product-image-section">
          <img src={product.image} alt={product.name} />
        </div>

        {/* RIGHT SIDE INFO */}
        <div className="product-info">

          <h1 className="title">{product.name}</h1>
          <p className="brand">{product.brand}</p>

          <h2 className="price">₹{product.price}</h2>

          <p className="desc">{product.description}</p>

          <div className="btn-group">

            <button
              className="cart-btn"
              onClick={() => alert("Cart next step ")}
            >
              Add to Cart
            </button>

            <button className="wishlist-btn">
              Wishlist 
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;