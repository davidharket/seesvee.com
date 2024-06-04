import React, { useState, useEffect } from "react";
import "./uplaodFile.scss";
import download from "../../images/download.png";
import downloaded from "../../images/downloaded.png";
import { useElements, useStripe } from "@stripe/react-stripe-js";

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [fileSize, setFileSize] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [error, setError] = useState("");
  const [showChunksInput, setShowChunksInput] = useState(false);
  const [chunks, setChunks] = useState(5);
  const [getId, setGetId] = useState("");

  useEffect(() => {
    const storedFile = localStorage.getItem("selectedFile");
    const storedFileSize = localStorage.getItem("fileSize");
    const storedRowCount = localStorage.getItem("rowCount");
    const storedUploadStatus = localStorage.getItem("uploadStatus");
    const storedId = localStorage.getItem("_id");
    if (
      storedFile &&
      storedFileSize &&
      storedRowCount &&
      storedUploadStatus &&
      storedId
    ) {
      setSelectedFile(JSON.parse(storedFile));
      setFileSize(parseInt(storedFileSize));
      setRowCount(parseInt(storedRowCount));
      setUploadStatus(storedUploadStatus);
      setGetId(storedId);
    }
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (
        file.type !== "text/csv" &&
        file.name.split(".").pop().toLowerCase() !== "csv"
      ) {
        setError("Not a Valid CSV file");
        setSelectedFile(null);
        setFileSize(0);
        setRowCount(0);
        event.target.value = null;
        return;
      } else {
        setError("");
      }
      setSelectedFile(file);
      setFileSize(file.size);

      const formData = new FormData();
      formData.append("file", file);

      fetch("http://localhost:3000/seesvee/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const uploadFile = data.uploadFile;
            setRowCount(uploadFile.rowCount);
            setFileSize(uploadFile.fileSize);
            setUploadStatus("success");
            setGetId(uploadFile._id);
            localStorage.setItem("selectedFile", JSON.stringify(file));
            localStorage.setItem("fileSize", uploadFile.fileSize);
            localStorage.setItem("rowCount", uploadFile.rowCount);
            localStorage.setItem("_id", uploadFile._id);
            localStorage.setItem("uploadStatus", "success");
          } else {
            setError(data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setError("Failed to upload file");
        });
    }
  };

  const formatFileSize = (size) => {
    if (size > 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else if (size > 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else {
      return `${size} bytes`;
    }
  };
  const handleCutItUpClick = async (id) => {
    setShowChunksInput(true);
  };

  const handleCheckOutPayment = async (fileId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/seesvee/create-checkout-session/${fileId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chunks,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        window.location.href = data.session.url;
        localStorage.setItem("token", data.token);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    setSelectedFile(null);
  }, []);

  return (
    <div className="uploadModule">
      <div className="pageContainer">
        <div className="uploadModule__col">
          <div className="uploadBox">
            <div className="uploadBox__inner">
              {!selectedFile ? (
                <>
                  <img
                    className="uploadBox__inner-img"
                    src={download}
                    alt="download"
                  />
                  <h2 className="uploadBox__inner-title">
                    Click to upload you .CSV file
                  </h2>
                  <p>Or drag and drop! </p>
                </>
              ) : (
                <>
                  <img
                    src={downloaded}
                    alt="downloaded"
                    className="uploadBox__inner-img"
                  />

                  <h2 className="uploadBox__inner-title">
                    {selectedFile.name}
                  </h2>
                </>
              )}

              <input
                type="file"
                id="file-upload"
                //   className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            <div className="selected-file"></div>
          </div>

          <div className="uploadedList">
            {error && <div className="error-message">{error}</div>}
            {selectedFile && (
              <div className="uploadedList__inner">
                {showChunksInput ? (
                  <>
                    <div className="uploadedList__field">
                      <div>
                        <label htmlFor="chunks">How many chunks:</label>
                        <input
                          type="number"
                          id="chunks"
                          name="chunks"
                          min="1"
                          value={chunks}
                          onChange={(e) => setChunks(e.target.value)}
                        />
                      </div>
                      <p>≈ 2.000 per file</p>
                    </div>
                    <div className="uploadedList__btn">
                      <button
                        className="btnGreen"
                        onClick={() => handleCheckOutPayment(getId)}
                      >
                        Download!
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="uploadedList__info">
                      <p className="uploadedList__info-item">
                        Total Rows: <span>{rowCount}</span>
                      </p>
                      <p className="uploadedList__info-item">
                        File Size: <span>{formatFileSize(fileSize)}</span>
                      </p>
                    </div>
                    <div className="uploadedList__btn">
                      <button
                        className="btnGreen"
                        onClick={() => handleCutItUpClick(getId)}
                      >
                        Cut it up!
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
