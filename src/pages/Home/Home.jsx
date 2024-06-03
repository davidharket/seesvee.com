import React from "react";
import download from "../../images/download.png";
import { Link } from "react-router-dom";
import "./home.scss";

const Home = () => {
  return (
    <div className="uploadBlock">
      <div className="pageContainer">
        <div className="uploadBlock__inner">
          <div className="uploadBlock__content">
            <h1 className="uploadBlock__title">Upload and split your CSV file in seconds</h1>
            <p>Split up your .CSV file with full control</p>
            <Link to={"/uploadFile"}>
              <button className="btnGreen">Upload file</button>
            </Link>
          </div>
          <div className="uploadBlock__img">
            <img src={download} alt="CSV Icon" className="csv-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
