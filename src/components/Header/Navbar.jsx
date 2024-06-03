import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./navbar.scss";

const Navbar = () => {
  return (
    <div className="mainHeader">
      <div className="pageContainer">
        <div className="mainHeader__inner">
          <Link to="/" className="mainHeader__logo">
            .SEESVEE
          </Link>
          <div className="mainHeader__menu">
            <Link to={"/"}>Home</Link>
            <Link to={"#"}>Why</Link>
            <Link to={"#"}>Split_it</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
