const express = require("express");
const router = express.Router();
const multer = require("multer");
const seesveeController = require("../controllers/seesvee.controller");
const upload = multer({ dest: "uploads/" });
const auth = require("../middleware/seesvee.auth");

router.post("/upload", upload.single("file"), seesveeController.upload);
router.post(
  "/create-checkout-session/:fileId",
  seesveeController.createCheckoutSession
);
router.get("/download/:fileId", auth, seesveeController.download);

module.exports = router;
