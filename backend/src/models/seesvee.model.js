const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const seesvee = new Schema({
  fileName: { type: String },
  filePath: { type: String },
  rowCount: { type: String },
  fileSize: { type: String },
  stripeId: { type: String },
  downloadUrl: { type: String },
});

const seesveeModel = mongoose.model("seesvee", seesvee);
module.exports = seesveeModel;
