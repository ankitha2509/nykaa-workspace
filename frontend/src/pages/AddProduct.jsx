import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./AddProduct.css";

function AddProduct() {
  const location = useLocation();
  const editProduct = location.state;

  const API = import.meta.env.VITE_API_URL;

  const [product, setProduct] = useState(
    editProduct || {
      name: "",
      brand: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      image: null
    }
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setProduct({
        ...product,
        image: e.target.files[0]
      });
    } else {
      setProduct({
        ...product,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(product).forEach((key) => {
        if (product[key]) {
          formData.append(key, product[key]);
        }
      });

      const url = editProduct
        ? `${API}/api/product/update/${editProduct._id}`
        : `${API}/api/product/add`;

      const method = editProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData
      });

      const data = await res.json();

      alert(data.message);

    } catch (error) {
      alert("Product upload failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2>
        {editProduct ? "Update Product" : "Add Product"}
      </h2>

      <form onSubmit={handleSubmit} className="product-form">

        <input name="name" placeholder="Name"
          value={product.name}
          onChange={handleChange} required />

        <input name="brand" placeholder="Brand"
          value={product.brand}
          onChange={handleChange} required />

        <input name="price" type="number"
          placeholder="Price"
          value={product.price}
          onChange={handleChange} required />

        <input name="stock" type="number"
          placeholder="Stock"
          value={product.stock}
          onChange={handleChange} required />

        <textarea name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange} required />

        <input type="file"
          name="image"
          onChange={handleChange} />

        <button type="submit">
          {loading ? "Please wait..." : "Save Product"}
        </button>

      </form>
    </div>
  );
}

export default AddProduct;