import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Otp from "./pages/Otp";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import ViewProducts from "./pages/ViewProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Address from "./pages/Address";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";


const stripePromise = loadStripe("pk_test_51TJfOQRlygTIqOImwHGH2rja3XMueVUmVrLZbu0TdyZKQS241szMjEyoeHiro8qCVlkW5ekcGyo24K34cKFsDnVP00zhAzQaAf");

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/home" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/view-products" element={<ViewProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/address" element={<Address />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin/manage-orders" element={<ManageOrders />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} /> 
        
        <Route
          path="/payment"
          element={
            stripePromise ?(
            <Elements stripe={stripePromise}>
              <Payment />
            </Elements>
          ) : (
            <h2>LOADING PAYMENT.....</h2>
          )
          }
        />

        <Route path="/profile" element={<Profile />} />

        <Route path="*" element={<h1>404 Page Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;