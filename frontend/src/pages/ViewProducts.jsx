import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewProducts.css";

function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  // ==============================
  // FETCH PRODUCTS
  // ==============================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/api/product/all`);

      // safety check (IMPORTANT)
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setProducts(data);

    } catch (error) {
      console.log(error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==============================
  // DELETE PRODUCT
  // ==============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API}/api/product/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      alert(data.message || "Deleted");

      fetchProducts();

    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  // ==============================
  // LOADING UI
  // ==============================
  if (loading) {
    return (
      <div className="view-products-container">
        <h3>Loading products...</h3>
      </div>
    );
  }

  return (
    <div className="view-products-container">

      <h2>All Products</h2>

      {products.length === 0 ? (
        <h3>No Products Found</h3>
      ) : (
        <table className="product-table">

          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {products.map((product) => (
              <tr key={product._id}>

                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-img"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/80";
                    }}
                  />
                </td>

                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.category}</td>
                <td>₹ {product.price}</td>
                <td>{product.stock}</td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate("/admin/add-product", {
                        state: product,
                      })
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>
      )}

    </div>
  );
}

export default ViewProducts;