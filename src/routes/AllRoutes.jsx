import React from "react";
import { Route, Routes } from "react-router-dom";
import Split from "../pages/Split";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import UploadFile from "../pages/upload/UploadFile";
import DownloadPage from "../pages/downloadPage/DownloadPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const AllRoutes = () => {
  const key = process.env.REACT_APP_PUBLISHIBLE_KEY;
  const stripePromise = loadStripe(key);
  const options = {
    mode: "payment",
    amount: 1099,
    currency: "usd",
  };

  return (
    <div>
      <Elements stripe={stripePromise} options={options}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/#" element={<About />} />
          <Route path="/#" element={<Split />} />
          <Route path="/uploadFile" element={<UploadFile />} />
          <Route path="/downloadPage/:fileId" element={<DownloadPage />} />
        </Routes>
      </Elements>
    </div>
  );
};

export default AllRoutes;
