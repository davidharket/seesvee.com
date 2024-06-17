const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const json2csv = require("json2csv").parse;
const archiver = require("archiver");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const stripe = require("stripe");
const seesveeModel = require("../models/seesvee.model");

dotenv.config();

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

const upload = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".csv" && ext !== ".xlsx") {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        error: "Invalid file format. Only CSV or XLSX files are allowed.",
      });
    }

    const uploadDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const newFilePath = path.join(uploadDir, file.originalname);

    fs.rename(file.path, newFilePath, async (err) => {
      if (err) {
        console.error("Error moving file:", err);
        return res.status(500).json({ error: "Error processing file." });
      }

      const results = [];
      fs.createReadStream(newFilePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          const rowCount = results.length;
          const fileSize = file.size;
          const uploadFile = new seesveeModel({
            fileName: file.originalname,
            filePath: newFilePath,
            rowCount: rowCount.toString(),
            fileSize: fileSize.toString(),
          });
          await uploadFile.save();

          res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            uploadFile,
          });
        })
        .on("error", (error) => {
          console.error("Error reading CSV file:", error);
          res.status(500).json({ error: "Error processing file." });
        });
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const splitFile = async (fileInfo, chunks, sessionID) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const chunkSize = Math.ceil(fileInfo.rowCount / chunks);
    fs.createReadStream(fileInfo.filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          const zip = archiver("zip");
          const uploadDir = path.join(__dirname, "..", "uploads");
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
          }
          const zipPath = path.join(uploadDir, `${sessionID}.zip`);
          const output = fs.createWriteStream(zipPath);
          output.on("close", () => {
            console.log(
              `ZIP file ${sessionID}.zip has been finalized and the output file descriptor has closed.`
            );
            resolve(zipPath);
          });
          output.on("end", () => {
            console.log("Data has been drained");
          });

          zip.on("warning", (err) => {
            if (err.code === "ENOENT") {
              console.warn("ZIP warning", err);
            } else {
              reject(err);
            }
          });

          zip.on("error", (err) => {
            console.error("ZIP error", err);
            reject(err);
          });

          zip.pipe(output);

          const fields = results.length > 0 ? Object.keys(results[0]) : [];
          for (let i = 0; i < chunks; i++) {
            const chunkData = results.slice(i * chunkSize, (i + 1) * chunkSize);
            const csvData = json2csv(chunkData, { fields });
            zip.append(csvData, { name: `chunk_${i + 1}.csv` });
          }

          zip.finalize();
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

const createCheckoutSession = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { chunks } = req.body;

    if (!chunks) {
      return res.status(400).json({
        success: false,
        message: "Please enter the number of chunks.",
      });
    }

    const perChunkAmount = 160;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "Please enter a fileId.",
      });
    }

    const fileInfo = await seesveeModel.findById(fileId);
    if (!fileInfo) {
      return res.status(400).json({ error: "File not found." });
    }

    const zipPath = await splitFile(fileInfo, chunks, req.sessionID);

    fileInfo.downloadUrl = zipPath;
    await fileInfo.save();

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "CSV Split Service",
            },
            unit_amount: perChunkAmount,
          },
          quantity: chunks,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/downloadPage/${fileId}`,
      cancel_url: `http://localhost:3000/cancel`,
    });

    const token = jwt.sign(
      { stripeSessionID: session.id },
      process.env.TOKEN_PRIVATE_KEY
    );

    fileInfo.stripeId = session.id;
    await fileInfo.save();

    res.status(200).json({ success: true, token, session });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

const download = async (req, res) => {
  try {
    const session_id = req.stripeSessionID;
    const { fileId } = req.params;
    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "Please enter a fileId.",
      });
    }

    const fileInfo = await seesveeModel.findById(fileId);
    if (fileInfo.stripeId !== session_id || !fileInfo.downloadUrl) {
      return res
        .status(400)
        .json({ error: "Invalid session or file not found." });
    }

    const zipPath = fileInfo.downloadUrl;
    if (!fs.existsSync(zipPath)) {
      return res.status(404).json({ error: "File not found." });
    }

    res.setHeader('Content-Disposition', `attachment; filename=chunks_${fileId}.zip`);
    res.setHeader('Content-Type', 'application/zip');

    const fileStream = fs.createReadStream(zipPath);
    fileStream.pipe(res);
    fileStream.on('error', (err) => {
      console.error("Error during file streaming:", err);
      res.status(500).json({ error: "Error streaming file." });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  upload,
  createCheckoutSession,
  download,
};
