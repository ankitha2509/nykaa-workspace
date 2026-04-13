import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewProducts.css";

function ViewProducts() {

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/product/all");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:5000/api/product/delete/${id}`, {
      method: "DELETE"
    });

    fetchProducts();
  };

  return (
    <div className="view-products-container">

      <h2>All Products</h2>

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
                  src={`http://localhost:5000/${product.image}`}
                  alt="product"
                  className="product-img"
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
                    navigate("/admin/add-product", { state: product })
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

    </div>
  );
}

export default ViewProducts;