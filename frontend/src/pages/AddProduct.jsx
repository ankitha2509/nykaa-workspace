import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./AddProduct.css";

function AddProduct() {

  const location = useLocation();
  const editProduct = location.state;

  const [product, setProduct] = useState(
    editProduct || {
      name: "",
      brand: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      image: null,
    }
  );

  const handleChange = (e) => {

    if (e.target.name === "image") {
      setProduct({ ...product, image: e.target.files[0] });
    }

    else {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("brand", product.brand);
    formData.append("category", product.category);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    formData.append("description", product.description);

    if (product.image) {
      formData.append("image", product.image);
    }

    const url = editProduct
      ? `https://backend-1bfu.onrender.com/api/product/update/${editProduct._id}`
      : "https://backend-1bfu.onrender.com/api/product/add";

    const method = editProduct ? "PUT" : "POST";

    const res = await fetch(url, {
      method: method,
      body: formData,
    });

    const data = await res.json();

    alert(data.message);

    setProduct({
      name: "",
      brand: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      image: null,
    });

  };

  return (
    <div className="add-product-container">

      <h2>
        {editProduct ? "Update Product" : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit} className="product-form">

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={product.brand}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Makeup">Makeup</option>
          <option value="Skin">Skin</option>
          <option value="Hair">Hair</option>
          <option value="Appliances">Appliances</option>
          <option value="Bath & Body">Bath & Body</option>
          <option value="Natural">Natural</option>
          <option value="Mom & Baby">Mom & Baby</option>
          <option value="Health & Wellness">Health & Wellness</option>
          <option value="Men">Men</option>
          <option value="Fragrance">Fragrance</option>
        </select>

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={product.stock}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit">
          {editProduct ? "Update Product" : "Add Product"}
        </button>

      </form>

    </div>
  );
}

export default AddProduct;