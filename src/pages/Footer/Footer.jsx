import React from "react";
import { Link } from "react-router-dom";
import "./footer.scss"

const Footer = () => {
  return (
    <div className="mainFooter">
      <div className="pageContainer">
        <div className="mainFooter__inner">
          <div className="mainFooter__info">
            <h5 className="mainFooter__logo">Seesvee</h5>
            <Link className="mainFooter__mail" href="mailto:hello@seesvee.com">
              hello@seesvee.com
            </Link>
            <Link className="mainFooter__link">
              Privacy Policy
            </Link>
          </div>
          <div className="mainFooter__text">
            <p>A <span className="link">Drift</span> Solution</p>
          </div>
          <div className="mainFooter__menu">
            <Link>Home</Link>
            <Link>Why</Link>
            <Link>Split it!</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
