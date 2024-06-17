import React, { useState, useEffect } from "react";
import download from "../../images/download.png";
import downloaded from "../../images/downloaded.png";
import "./uplaodFile.scss";
const UploadFile = () => {
  const [fileData, setFileData] = useState({
    selectedFile: null,
    uploadStatus: "idle",
    fileSize: 0,
    rowCount: 0,
    error: "",
    chunks: 5,
    getId: "",
    fileName: "",
  });
  const [showChunksInput, setShowChunksInput] = useState(false);

  useEffect(() => {
    const storedData = {
      selectedFile: JSON.parse(localStorage.getItem("selectedFile")),
      fileSize: localStorage.getItem("fileSize"),
      rowCount: localStorage.getItem("rowCount"),
      uploadStatus: localStorage.getItem("uploadStatus"),
      getId: localStorage.getItem("_id"),
      fileName: localStorage.getItem("fileName"),
    };

    if (storedData.selectedFile) {
      setFileData({
        ...fileData,
        ...storedData,
      });
    }
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (
        fileType !== "text/csv" &&
        fileExtension !== "csv" &&
        fileType !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        fileExtension !== "xlsx"
      ) {
        setFileData({ ...fileData, error: "Not a Valid CSV file" });
        event.target.value = null;
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:3000/seesvee/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          const uploadFile = data.uploadFile;
          setFileData({
            ...fileData,
            selectedFile: file,
            rowCount: uploadFile.rowCount,
            fileSize: uploadFile.fileSize,
            fileName: uploadFile.fileName,
            uploadStatus: "success",
            getId: uploadFile._id,
          });
          localStorage.setItem("selectedFile", JSON.stringify(file));
          localStorage.setItem("fileSize", uploadFile.fileSize);
          localStorage.setItem("rowCount", uploadFile.rowCount);
          localStorage.setItem("_id", uploadFile._id);
          localStorage.setItem("fileName", uploadFile.fileName);
          localStorage.setItem("uploadStatus", "success");
        } else {
          setFileData({ ...fileData, error: data.message });
        }
      } catch (error) {
        console.error("Error:", error);
        setFileData({ ...fileData, error: "Failed to upload file" });
      }
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

  const handleCutItUpClick = () => {
    setShowChunksInput(true);
  };

  const handleCheckOutPayment = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/seesvee/create-checkout-session/${fileData.getId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chunks: fileData.chunks }),
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

  const { selectedFile, rowCount, fileSize, error, chunks, fileName } =
    fileData;

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
                    Click to upload your .CSV file
                  </h2>
                  <p>Or drag and drop!</p>
                </>
              ) : (
                <>
                  <img
                    src={downloaded}
                    alt="downloaded"
                    className="uploadBox__inner-img"
                  />
                  <h2 className="uploadBox__inner-title">{fileName}</h2>
                </>
              )}
              <input type="file" id="file-upload" onChange={handleFileUpload} />
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
                          onChange={(e) =>
                            setFileData({ ...fileData, chunks: e.target.value })
                          }
                        />
                      </div>
                      <p>≈ 2,000 per file</p>
                    </div>
                    <div className="uploadedList__btn">
                      <button
                        className="btnGreen"
                        onClick={handleCheckOutPayment}
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
                      <button className="btnGreen" onClick={handleCutItUpClick}>
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
