import React from "react";
import Navbar from "./components/Header/Navbar";
import AllRoutes from "./routes/AllRoutes";
import '../src/assets/fonts/fonts.css'
import "./App.scss";
import Footer from "./pages/Footer/Footer";

function App() {
  return (
    <>
      <Navbar />
      <AllRoutes />
      <Footer />
    </>
  );
}

export default App;
