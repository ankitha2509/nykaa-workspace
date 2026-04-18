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

  if (!product) return <h2>Loading...</h2>;

  return (
    <div className="product-details">

      <img src={product.image} alt={product.name} />

      <h2>{product.name}</h2>
      <h4>{product.brand}</h4>

      <p>₹{product.price}</p>
      <p>{product.description}</p>

      <button onClick={() => alert("Cart next step 👍")}>
        Add To Cart
      </button>

    </div>
  );
}

export default ProductDetails;