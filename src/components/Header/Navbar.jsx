import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.scss";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("download")) {
      setOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className={open ? "mainHeader activeMenu" : "mainHeader"}>
      <div className="pageContainer">
        <div className="mainHeader__inner">
          <Link to="/" className="mainHeader__logo">
            .seesvee
          </Link>
          {location.pathname.includes("download") ? null : (
            <div className="mainHeader__menu">
              <Link to={"/"}>Home</Link>
              <Link to={"#"}>Why</Link>
              <Link to={"#"}>Split_it</Link>
            </div>
          )}
          <div onClick={() => setOpen(!open)} className="mainHeader__menuBtn">
            {!open ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
