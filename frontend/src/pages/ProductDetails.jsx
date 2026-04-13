import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductDetails.css";

function ProductDetails() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/product/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.log(err));
  }, [id]);

  const handleAddToCart = async () => {

  
    if (!userId) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,          
          productId: product._id,  
          quantity: 1,
        }),
      });

      const data = await res.json();
      alert(data.message);

      navigate("/cart");

    } catch (err) {
      console.log(err);
      alert("Error adding to cart");
    }
  };

  if (!product) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="product-details">

      <div className="details-container">

        <img
          src={`http://localhost:5000/${product.image}`}
          alt={product.name}
        />

        <div className="details-info">

          <h2>{product.name}</h2>
          <h4>{product.brand}</h4>

          <p className="price">₹{product.price}</p>
          <p className="desc">{product.description}</p>

          <button className="cart-btn" onClick={handleAddToCart}>
            Add To Cart
          </button>

          <button className="wishlist-btn">Wishlist</button>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;