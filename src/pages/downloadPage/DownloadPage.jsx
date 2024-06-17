import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./download.scss";
import downloaded from "../../images/downloaded.png";

const DownloadPage = () => {
  const { fileId } = useParams();
  const token = localStorage.getItem('token');
  const fileUrl = `http://localhost:3000/seesvee/download/${fileId}`;

  const triggerDownload = async (token, fileUrl) => {
    try {
      const response = await fetch(fileUrl, {
        headers: {
          "authorization": token
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "chunks.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    triggerDownload(token, fileUrl);
  }, [token, fileUrl]);

  const handleManualDownload = () => {
    triggerDownload(token, fileUrl);
  };

  return (
    <main className="cardModule">
      <div className="pageContainer">
        <div className="cardModule__box">
          <img src={downloaded} className="cardModule__box-img" alt="Downloaded" />
          <h1 className="cardModule__box-title">Thank you!</h1>
          <p>Your files will download automatically</p>
          <button className="btnGreen" onClick={handleManualDownload}>
            Download!
          </button>
          <p>Click here to manually download!</p>
        </div>
      </div>
    </main>
  );
};

export default DownloadPage;
