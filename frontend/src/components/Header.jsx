import React, { useState } from "react";
import { FiUser, FiShoppingBag, FiBox, FiHeart, FiCreditCard, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [showLogin, setShowLogin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
    
      <div className="promo-bar">
        <div className="promo-left">
          <div className="marquee">
            <span>BEAUTY BONANZA Get Your Amazing Deals!</span>
          </div>
        </div>

        <div className="promo-right">
          <a href="#"><i className="fa-solid fa-mobile-screen-button"></i> Get App</a>
          <span>|</span>
          <a href="#"><i className="fa-solid fa-location-dot"></i> Store & Events</a>
          <span>|</span>
          <a href="#"><i className="fa-solid fa-gift"></i> Gift Card</a>
          <span>|</span>
          <a href="#"><i className="fa-regular fa-circle-question"></i> Help</a>
        </div>
      </div>

  
      <header className="header">
        <div className="header-top">

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/00/Nykaa_New_Logo.svg"
            alt="Nykaa"
            className="logo"
          />

         
          <div className="menu">

  <div className="menu-item">Categories</div>

  <div className="menu-item brands-dropdown">

    Brands

    <div className="brands-box">

   
      <div className="brands-left">
        <input
          type="text"
          placeholder="Search brands..."
          className="brand-search"
        />
      </div>

   
      <div className="brands-right">

     
        <div className="brand-types">
          <div className="brand-type active">Popular</div>
          <div className="brand-type">Luxe</div>
          <div className="brand-type">Only at Nykaa</div>
          <div className="brand-type">New Launches</div>
        </div>

  
        <div className="brand-list">

          <p>Maybelline</p>
          <p>Lakme</p>
          <p>MAC</p>
          <p>Nykaa Cosmetics</p>
          <p>Kay Beauty</p>
          <p>Charlotte Tilbury</p>
          <p>Huda Beauty</p>
          <p>L'Oreal Paris</p>

        </div>

      </div>

    </div>

  </div>

  <div className="menu-item">Luxe</div>
  <div className="menu-item">Beauty Advice</div>
  <div className="menu-item">Nykaa Fashion</div>

</div>

          <div className="search-box">
            <input type="text" placeholder="Search on Nykaa" />
          </div>

  
          <div className="right-section">

      
            {!isLoggedIn ? (
              <button
                className="signin-btn"
                onClick={() => {
                  setShowLogin(!showLogin);
                  setShowDropdown(false);
                }}
              >
                Sign In
              </button>
            ) : (

              <div
                className="profile-wrapper"
                onClick={() => {
                  setShowDropdown(!showDropdown);
                  setShowLogin(false);
                }}
              >
                <FiUser size={22} />

               {showDropdown && (
  <div className="profile-dropdown">

    <div className="dropdown-item" onClick={() => navigate("/order-history")}>
      <FiBox size={16} /> Orders
    </div>

    <div className="dropdown-item" onClick={() => navigate("/profile")}>
      <FiUser size={16} /> Profile
    </div>

    <div className="dropdown-item">
      <FiCreditCard size={16} /> Wallet
    </div>

    <div className="dropdown-item">
      <FiHeart size={16} /> Wishlist
    </div>

                    <div
                      className="logout"
                      onClick={() => {
                        localStorage.removeItem("isLoggedIn");
                        localStorage.removeItem("user");
                        setIsLoggedIn(false);
                        setShowDropdown(false);
                      }}
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            )}

           
          <div 
            className="cart-icon"
            onClick={() => navigate("/cart")}
          >
            <FiShoppingBag size={24} />
          </div>

          </div>
        </div>

     
        {showLogin && (
          <div className="login-overlay">
            <div className="login-box">

              <button
                className="close-btn"
                onClick={() => setShowLogin(false)}
              >
                ×
              </button>

              <h2>Login or Signup</h2>

              <p className="reward-text">
                Register now and get <b>2000 Nykaa reward points</b> instantly!
              </p>

          
              <button
                className="login-btn"
                onClick={() => {
                  setShowLogin(false);
                  navigate("/login");
                }}
              >
                Login
              </button>

              <div className="divider">
                Or sign in using
              </div>

             
              <button
                className="login-btn"
                onClick={() => {
                  setShowLogin(false);
                  navigate("/signup");
                }}
              >
                Sign in with Mobile / Email
              </button>

            </div>
          </div>
        )}

        <div className="category-bar">

  <div className="category-item dropdown">
    Makeup

    <div className="dropdown-content">

      <div className="dropdown-column">
        <h4>Face</h4>                              
        <p>Face Primer</p>
        <p>Concealer</p>
        <p>Foundation</p>
        <p>Compact</p>
        <p>Contour</p>
        <p>Loose Powder</p>
        <p>Tinted Moisturizer</p>
        <p>Blush</p>
        <p>Bronzer</p>
        <p>BB & CC cream</p>
        <p>Highlighters</p>
        <p>Setting Spray</p>
        <p>Makeup Remover</p>
        <p>Sindoor</p>
      </div>

      <div className="dropdown-column">
        <h4>Eyes</h4>      
        <p>Kajal</p>
        <p>Eyeliner</p>
        <p>Mascara</p>
        <p>Eye Shadow</p>
        <p>Eye Brow Enhancers</p>
        <p>Eye Primer</p>
        <p>False Eyelashes</p>
        <p>Eye Makeup Remover</p>
        <p>Under Eye Concealer</p>
        <p>Contact Lenses</p>
      </div>

      <div className="dropdown-column">
        <h4>Lips</h4>            
        <p>Lipstick</p>
        <p>Lip Balm</p>
        <p>Lip Gloss</p>
        <p>liquid Lipstick</p>
        <p>Lip Crayon</p>
        <p>Lip Liner</p>
        <p>Lip Plumper</p>
        <p>Lip Tint</p>
      </div>


      <div className="dropdown-column">
        <h4>Nails</h4>
        <p>Nail Polish</p>
        <p>Nail Art</p>
        <p>Nail Remover</p>
      </div>

      <div className="dropdown-column">                 
        <h4>Tools & Brushes</h4>
        <p>Makeup Brushes</p>
        <p>Beauty Blender</p>
        <p>Brush Cleaners</p>
        <p>Face Brush</p>
        <p>Eye Brush</p>
        <p>Lip Brush</p>
        <p>Brush Sets</p>
        <p>Sponges & Applicators</p>
        <p>Eyelash Curlers</p>
        <p>Tweezers</p>
        <p>Sharpeners</p>
        <p>Mirrors</p>
        <p>Makeup Pouches</p>

      </div>

      <div className="dropdown-column">
        <h4>Top Brands</h4>        
        <p>Maybelline New York</p>
        <p>Lakme</p>
        <p>M.A.C</p>
        <p>Nykaa Cosmetics</p>
        <p>Kay Beauty</p>
        <p>Huda Beauty</p>
        <p>Charlotte Tilbury</p>
        <p>L'Oreal Paris</p>
        <p>Nyx Pro.Makeup</p>
      </div>

    </div>

  </div>

 
   <div className="category-item dropdown1">
    Skin
    <div className="dropdown-content1">
      <div className="dropdown-column1">
        <h4>Moisturizers</h4>
        <p> Face Moisturizer & Day Cream</p>  
        <p>Night Cream</p>
        <p>Face Oils</p>
        <p>All Purpose Gels/Creams</p>
      </div>
        
      <div className="dropdown-column1">  
        <h4>Cleansers</h4>
        <p>Face Wash</p>  
        <p>Cleanser</p>
        <p>Micellar Water</p>
        <p>Face Wipes</p>
        <p>Makeup Remover</p>
        <p>Scrubs & Exfoliators</p>   
      </div>
      <div className="dropdown-column1">  
        <h4>Body Care</h4>
        <p>Lotions & Creams</p>  
        <p>Body Butter</p>
        <p>Massage Oils</p>
        <p>Shower Gels & Body Wash</p>
        <p>Soaps</p>
        <p>Scrubs & Loofahs</p>
        <p>Bath Salts</p>
      </div>

      <div className="dropdown-column1">   
        <h4>Hands & Feet</h4>
        <p>Hand Creams</p>  
        <p>Foot Creams</p>
        <p>Hand & Foot Masks</p>
      </div>

      <div className="dropdown-column1">      
        <h4>Skin Tools</h4>
        <p>Face Massagers</p>  
        <p>Cleansing Brushes</p>
        <p>Blackhead Remover</p>
        <p>Dermarollers</p>    
      </div>

      <div className="dropdown-column1">      
        <h4>Kits & Combos</h4>
        <p>Combos @ Nykaa</p>  
        <p>Gift Sets</p>
      </div>

      <div className="dropdown-column1">
        <h4> Serums</h4>
        <p>Serums & Essence</p>
      </div>

      </div>
   </div>
  
  <div className="category-item dropdown2">
    Hair
   <div className="dropdown-content2">
    <div className="dropdown-column2">
      <h4>Hair Care</h4>
      <p>Shampoo</p>
      <p>Dry Shampoo</p>
      <p>Conditioner</p>
      <p>Hair Serum</p>
      <p>Hair Oil</p>
      <p>Hair Supplements</p>
      <p>Leave-in Conditioner</p>
    </div>

    <div className="dropdown-column2"> 
      <h4>Top Brands</h4>
      <p>Nykaa Naturals</p>
      <p>Wella Professionals</p>
      <p>L'Oreal Paris</p>
      <p>L'Oreal Professionnel</p>
      <p>BBlunt</p>
      <p>Herbal Essences</p>
      <p>Schwarzkopf Professional</p>
    </div>

    <div className="dropdown-column2">
      <h4>Hair Styling</h4>
      <p>Hair Spray</p>
      <p>Gels & Waxes</p>
      <p>Hair Color</p>
    </div>

    <div className="dropdown-column2">
      <h4>Shop By Hair Type</h4>
      <p>Straight</p>
      <p>Curly & Wavy</p>
    </div>

  </div>
</div>

<div className="category-item dropdown3">
    Appliances
   <div className="dropdown-content3">
    <div className="dropdown-column3"> 
      <h4>Hair Styling Tools</h4>
      <p>Hair Dryers</p>
      <p>Straighteners</p>
      <p>Straightening Brushes</p>
      <p>Curling Iron/Stylers</p>
      <p>Multi Stylers</p>
      <p>Blow Brushes</p>
      <p>Leave-in Conditioner</p>
    </div>

    <div className="dropdown-column3">
      <h4>Pro Hair Styling</h4>
      <p>Pro Hair Dryers</p>
      <p>Pro Straighteners</p>
      <p>Pro Straightening Brushes</p>
      <p>Pro Curling Iron/Stylers</p>
    </div>

    <div className="dropdown-column3">  
       <h4>Top Brands</h4>
      <p>FOREO</p>
      <p>Philips</p>
      <p>Alan Truman</p>
      <p>Dyson</p>
      <p>VEGA</p>
      <p>Braun</p>
      <p>Ikonic Professional</p>
      <p>Nova</p>
      <p>Flawless</p>
    </div>
  </div>
</div>

  <div className="category-item">Bath & Body</div>
  <div className="category-item">Natural</div>
  <div className="category-item">Mom & Baby</div>
  <div className="category-item">Health & Wellness</div>
  <div className="category-item">Men</div>
  <div className="category-item">Fragrance</div>
  <div className="category-item">Lingerie & Accessories</div>

</div>
        

      

      </header>
    </>
  );
}

export default Header;