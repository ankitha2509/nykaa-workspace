import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch("https://backend-1bfu.onrender.com/api/product/all")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);


  const carouselImages = [
    "https://images-static.nykaa.com/creatives/799e2fb0-4fb4-4012-a540-74685448b1fa/default.jpg",
    "https://images-static.nykaa.com/creatives/1c155d5e-31d3-4e7b-9bfb-1e901bbb34d2/default.jpg",
    "https://images-static.nykaa.com/creatives/57b3da96-bf99-4ce4-8309-c99b705eb5aa/default.jpg",
    "https://images-static.nykaa.com/creatives/ac423ec0-e19c-4370-8d9a-b349659ff6e9/default.jpg?tr=cm-pad_resize,w-900",
    "https://images-static.nykaa.com/creatives/329e2353-8bb7-4109-abce-ba6f9c60f35f/default.jpg",
    "https://images-static.nykaa.com/creatives/4c8a4a6a-33f3-4e74-8d0d-b6587f7002bc/default.png",
    "https://images-static.nykaa.com/uploads/79e2c68f-d534-4b50-b1fb-bdf89a24457b.gif",
    "https://images-static.nykaa.com/uploads/f15e742d-5790-4a6a-976a-0cdbf34a1e8d.jpg?tr=cm-pad_resize,w-900",
    "https://images-static.nykaa.com/creatives/37666a78-895c-4954-8345-d1491cf55c63/default.jpg?tr=cm-pad_resize,w-900",
    "https://images-static.nykaa.com/creatives/f3ca7dd3-f2c8-4f21-8914-fa288478d33b/default.jpg?tr=cm-pad_resize,w-900",
    "https://images-static.nykaa.com/creatives/4b597f80-a7ce-4a7b-9e80-9ca433c8e0d3/default.jpg?tr=cm-pad_resize,w-900"
  ];

  const [offerSlide, setOfferSlide] = useState(0);

  const offerImages = [
    "https://images-static.nykaa.com/uploads/4424e7ac-9bae-46f4-8a94-d65f844a9657.jpg?tr=cm-pad_resize,w-1800",
    "https://images-static.nykaa.com/uploads/f9d23e20-059f-4a4c-a2af-ff07776e8031.jpg?tr=cm-pad_resize,w-1800"
];

  const [midSlide, setMidSlide] = useState(0);

  const midImages = [
  "https://images-static.nykaa.com/creatives/656dea2d-903a-4ee9-a489-44267d2c51f3/default.jpg?tr=cm-pad_resize,w-900",
  "https://images-static.nykaa.com/creatives/ac9bf338-21c4-4816-a90b-ccbf712641fa/default.jpg?tr=cm-pad_resize,w-900",
  "https://images-static.nykaa.com/creatives/b90bf25c-b6fb-47ec-abb3-8cc1014061e9/default.jpeg?tr=cm-pad_resize,w-900",
  "https://images-static.nykaa.com/creatives/102f85de-de59-4bee-ba05-64cdccf81958/default.jpg?tr=cm-pad_resize,w-900",
  "https://images-static.nykaa.com/creatives/e4875c49-03f2-4173-ba1d-782aa12736c7/default.jpg?tr=cm-pad_resize,w-900",
  "https://images-static.nykaa.com/creatives/c0d56cf6-f853-48de-ab36-7b1c760d31e8/default.jpg?tr=cm-pad_resize,w-900",
  "https://images-static.nykaa.com/creatives/7ae100c8-b4be-444f-be60-a66142740e90/default.jpg?tr=cm-pad_resize,w-900", // ✅ fixed
  "https://images-static.nykaa.com/creatives/80cacdee-aa72-45d9-b855-1052668c4819/default.jpg?tr=cm-pad_resize,w-900"
];

const [peachSlide, setPeachSlide] = useState(0);

const peachProducts = [
   {
    image:"https://images-static.nykaa.com/media/catalog/product/b/2/b2dae8bWINST00000055_1.jpg?tr=cm-pad_resize,w-500,h-500",
    brand: "Winston",
    name: "Winston Airizona High-Speed Ionic Hair Dryer With Plasma Technology",
    price: 11999,
    originalPrice: 12999,
    discount: "8% OFF"
  },

   {
    image: "https://images-static.nykaa.com/media/catalog/product/b/7/b7abbb4ALANT00000224_1a.jpg?tr=cm-pad_resize,w-500,h-500",
    brand:  "Alan Truman",
    name: "Alan Truman Big Volumiser Set For Easy Blowdrying - Pastel Pink",
    price: 5999,
    originalPrice: 7399,
    discount: "20% OFF"
  },

   {
    image: "https://images-static.nykaa.com/media/catalog/product/b/4/b4c3103URBAK00000015_1.jpg?tr=cm-pad_resize,w-500,h-500",
    brand: "UrbanYog",
    name: "UrbanYog MakeMeeBold Hair Dryer and Volumizer Hot Air 3 in 1 Styling Brush - Rose Gold",
    price: 2599,
    originalPrice: 6399,
    discount: "65% OFF"
  },

   {
    image: "https://images-static.nykaa.com/media/catalog/product/2/4/243b75fCARAD00000059_1.jpg?tr=cm-pad_resize,w-500,h-500",
    brand: "Caresmith",
    name: "Caresmith Bloom 3-In-1 Hair Volumizer, Straightener And Dryer",
    price: 1899,
    originalPrice: 3399,
    discount: "35% OFF"
  },

   {
    image: "https://images-static.nykaa.com/media/catalog/product/2/f/2fb198cWINST00000064_1.jpg?tr=cm-pad_resize,w-500,h-500",
    brand: "Winston",
    name: "Winston 5 In 1 Hair Blow Brush Multi Styler For All Hair Types- Ice Blue ",
    price: 4299,
    originalPrice: 4999,
    discount: "15% OFF"
  },

   {
    image: "https://images-static.nykaa.com/media/catalog/product/7/b/7b8cdeb8904086303074_1.jpg?tr=cm-pad_resize,w-500,h-500",
    brand: "VEGA 3",
    name: "VEGA 3 in 1 Hair Styler- Straightener, Curler and Crimper for Women, Gold-Black (VHSCC-01)",
    price: 1699,
    originalPrice: 2199,
    discountMoisturizer: "25% OFF"
  },

   {
    image: "https://images-static.nykaa.com/media/catalog/product/b/2/b2dae8bWINST00000054_1.jpg?tr=cm-pad_resize,w-500,h-500",
    brand: "Winston",
    name: "Winston Flexy 8-In-1 Professional Powerful Multi-Styler Without Heat Damage",
    price: 16299,
    originalPrice: 24399,
    discount: "35% OFF"
  },

   {
    image: "https://images-static.nykaa.com/media/catalog/product/1/_/1_344.jpg?tr=cm-pad_resize,w-500,h-500",
    brand: "Havells",
    name: "Havells HC4045 5 in 1 Multi-Styling Kit - Turquoise",
    price: 2799,
    originalPrice: 3399,
    discount: "25% OFF"
  },

   {
    image: "https://images-static.nykaa.com/media/catalog/product/5/e/5e90e85AGARO00000040_1.jpg?tr=cm-pad_resize,w-500,h-500",
    brand: "Ikonic",
    name: "Ikonic Me Mini Vibe Hair Dryer - Blue Copper",
    price: 1399,
    originalPrice: 2099,
    discount: "35% OFF"
  },

   {
    image: "https://images-static.nykaa.com/media/catalog/product/3/2/3225d65PHIAA00000256b_1.jpg?tr=cm-pad_resize,w-500,h-500",
    brand: "Philips",
    name: "Hydrating Hair Dryer Retain 100% Hair Strength,Moisture Rich Shine,Gentle Mode,2 magnetic attachment",
    price: 16999,
    originalPrice: 19099,
    discount: "15% OFF"
  }
   
];

const hydrationRow1 = [
  {
    image: "https://images-static.nykaa.com/uploads/e98f6129-d5f1-4eae-b6d1-2d75e0afb086.jpg?tr=cm-pad_resize,w-450",
    text: "#1 Hydration Duo"
  },
  {
    image: "https://images-static.nykaa.com/uploads/ba12dda3-433b-49b7-9f0a-52a762b34929.jpg?tr=cm-pad_resize,w-450",
    text: "Bestsellers! Starting at ₹1600"
  },
  {
    image: "https://images-static.nykaa.com/uploads/93fbe4c1-94f2-48ad-bba9-8f636fb73c4c.jpg?tr=cm-pad_resize,w-450",
    text: "New Tinted Moisturiser with SPF 25"
  },
  {
    image: "https://images-static.nykaa.com/uploads/fc9964b8-50da-4d4b-9b11-34e8e1319746.jpg?tr=cm-pad_resize,w-450",
    text: "Glow Boost Essentials"
  }
];


const hydrationRow2 = [
  {
    image: "https://images-static.nykaa.com/uploads/0c00516e-623a-4126-ac3f-b0446c9a6da3.jpg?tr=cm-pad_resize,w-450",
    text: "From soft sculpt to sunlit bronze"
  },
  {
    image: "https://images-static.nykaa.com/uploads/64df7f72-82ee-47e5-8c81-dd12369d453b.png?tr=cm-pad_resize,w-450",
    text: "Glow Like Never Before"
  },
  {
    image: "https://images-static.nykaa.com/uploads/68fba68f-ae63-4ca0-bc09-84c6b8b0fd17.jpg?tr=cm-pad_resize,w-450",
    text: "New Launch! Burberry Her Parfum"
  },
  {
    image: "https://images-static.nykaa.com/uploads/dff64f3a-33fe-476a-ad7b-5483dc3783bb.jpg?tr=cm-pad_resize,w-450",
    text: "Explore the fragrances + Free Gifts"
  },
  {
    image: "https://images-static.nykaa.com/uploads/06bd9956-e5e9-4b26-8630-6907b1c8ccbc.jpg?tr=cm-pad_resize,w-450",
    text: "Unlock FREE Gifts on NEW! Concealer"
  }
];

const [brandSlide, setBrandSlide] = useState(0);

const brandImages = [
  "https://images-static.nykaa.com/uploads/a31e5cf7-6643-42ed-9103-58baac2c8f92.png?tr=cm-pad_resize,w-450",
  "https://images-static.nykaa.com/uploads/6edf7469-56cf-43c6-9e35-3797bb39de3a.png?tr=cm-pad_resize,w-450",
  "https://images-static.nykaa.com/uploads/e383dc2b-ac3c-4c42-b003-6b850f68ede0.png?tr=cm-pad_resize,w-450",
  "https://images-static.nykaa.com/uploads/2a8e0f17-9ed1-4793-99f8-bbea3568c5fe.png?tr=cm-pad_resize,w-450",
  "https://images-static.nykaa.com/uploads/39e26320-7881-42bb-beba-786ff0748b52.png?tr=cm-pad_resize,w-450",
  "https://images-static.nykaa.com/uploads/ad58d75f-3220-4fb4-b07a-6a784153904b.png?tr=cm-pad_resize,w-450",
  "https://images-static.nykaa.com/uploads/e6ec09ed-267b-4ed6-a799-887e787fa6b8.png?tr=cm-pad_resize,w-450",
  "https://images-static.nykaa.com/uploads/107e24ed-5b7d-4f9d-9a6e-5571fd5f7c57.png?tr=cm-pad_resize,w-450",
  "https://images-static.nykaa.com/uploads/60097d25-2e68-41c1-b736-5a6f43a9cec9.png?tr=cm-pad_resize,w-450",
  "https://images-static.nykaa.com/uploads/1a583b6e-1854-44b3-94d2-b621aaeeea6c.png?tr=cm-pad_resize,w-450",
  "https://images-static.nykaa.com/uploads/3f62ca6f-de33-4b59-b2da-48b6e16ec6b4.png?tr=cm-pad_resize,w-450"
];

  return (
    <div className="home">
      <Header />

      <div className="top-carousel">

        <button
          className="carousel-btn left"
          onClick={() =>
            setCurrentSlide(
              currentSlide === 0 ? 0 : currentSlide - 1
            )
          }
        >
          ◀
        </button>
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${currentSlide * (100 / 3)}%)`
          }}
        >
          {carouselImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="banner"
              className="carousel-card"
            />
          ))}
        </div>

        <button
          className="carousel-btn right"
          onClick={() =>
            setCurrentSlide(
              currentSlide >= carouselImages.length - 3
                ? carouselImages.length - 3
                : currentSlide + 1
            )
          }
        >
          ▶
        </button>

      </div>

      <div className="offer-banner">

        <button
          className="carousel-btn left"
          onClick={() =>
          setOfferSlide(offerSlide === 0 ? offerImages.length - 1 : offerSlide - 1)
        }
        >
         ◀
        </button>

        <div
          className="offer-track"
          style={{
          transform: `translateX(-${offerSlide * 100}%)`
        }}
        >
        {offerImages.map((img, index) => (
          <img key={index} src={img} alt="offer" className="offer-full" />
        ))}
        </div>

      <button
        className="carousel-btn right"
        onClick={() =>
        setOfferSlide((offerSlide + 1) % offerImages.length)
      }
      >
        ▶
   </button>
</div>

   
  <div className="mid-carousel-section">

  <div className="section-header">
    <h2>In The Spotlight</h2>
    <div className="line"></div>
  </div>

  <button
    className="carousel-btn left"
    onClick={() => midSlide > 0 && setMidSlide(midSlide - 1)}
  >
    ◀
  </button>

  <div
    className="mid-carousel-track"
    style={{
      transform: `translateX(-${midSlide * (100 / 3)}%)`
    }}
  >
    {midImages.map((img, index) => (
      <img key={index} src={img} alt="mid" className="mid-card" />
    ))}
  </div>

  <button
    className="carousel-btn right"
    onClick={() =>
      midSlide < midImages.length - 3 && setMidSlide(midSlide + 1)
    }
  >
    ▶
  </button>

</div>
       
<div className="peach-banner">
  <img
    src="https://images-static.nykaa.com/uploads/01bcef16-d4ba-46ab-8af2-a9eba59838ec.jpg?tr=cm-pad_resize,w-1800"
    alt="banner"
  />
</div>


<div className="peach-section">


  <button
    className="carousel-btn left"
    onClick={() => peachSlide > 0 && setPeachSlide(peachSlide - 1)}
  >
    ◀
  </button>


  <div
    className="peach-track"
    style={{
      transform: `translateX(-${peachSlide * (100 / 5)}%)`
    }}
  >
    {peachProducts.map((item, index) => (
      <div key={index} className="peach-product-card">

        <img src={item.image} alt={item.name} />

        <h4 className="brand">{item.brand}</h4>
        <p className="name">{item.name}</p>

        <div className="price-section">
          <span className="price">₹{item.price}</span>
          <span className="original">₹{item.originalPrice}</span>
        </div>

        <p className="discount">{item.discount}</p>

      </div>
    ))}
  </div>

  <button
    className="carousel-btn right"
    onClick={() =>
      peachSlide < peachProducts.length - 5 &&
      setPeachSlide(peachSlide + 1)
    }
  >
    ▶
  </button>

</div>
     
     <div className="hydration-section">

  <img
    src="https://images-static.nykaa.com/uploads/908466dc-f1fe-4eee-ac82-a9b59bd003c3.jpg?tr=cm-pad_resize,w-1800"
    alt="bg"
    className="hydration-bg"
  />

  <div className="hydration-content">


    <div className="hydration-row">
      {hydrationRow1.map((item, i) => (
        <div key={i} className="hydration-card">
          <img src={item.image} />
          <p>{item.text}</p>
        </div>
      ))}
    </div>


    <div className="hydration-row second">
      {hydrationRow2.map((item, i) => (
        <div key={i} className="hydration-card">
          <img src={item.image} />
          <p>{item.text}</p>
        </div>
      ))}
    </div>

  </div>

</div>

 <div className="explore-section">
  <button className="explore-btn">Explore All Brands</button>
</div>


<div
  className="brand-carousel-section"
  style={{
    backgroundImage: `url("https://images-static.nykaa.com/uploads/ecd2fe0a-4c16-4e2b-86b5-b984d8355cc4.jpg?tr=cm-pad_resize,w-1800")`
  }}
>
  <button
    className="carousel-btn left"
    onClick={() => brandSlide > 0 && setBrandSlide(brandSlide - 1)}
  >
    ◀
  </button>

  <div
    className="brand-track"
    style={{
      transform: `translateX(-${brandSlide * (100 / 5)}%)`
    }}
  >
    {brandImages.map((img, i) => (
      <img key={i} src={img} alt="brand" className="brand-card" />
    ))}
  </div>

  <button
    className="carousel-btn right"
    onClick={() =>
      brandSlide < brandImages.length - 5 &&
      setBrandSlide(brandSlide + 1)
    }
  >
    ▶
  </button>

</div>

      <div className="admin-products">
        <h2 className="admin-title">OUR PRODUCTS</h2>

        <div className="admin-product-grid">
          {products.map((item) => (
            <div
              className="admin-product-card"
              key={item._id}
              onClick={() => navigate(`/product/${item._id}`)}
            >
              <img
                src={`https://backend-1bfu.onrender.com/${item.image}`}
                alt={item.name}
              />

              <h4>{item.name}</h4>
              <p className="brand">{item.brand}</p>
              <p className="price">₹{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;