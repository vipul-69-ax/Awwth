const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, required: true },
  },
  {
    collection: "user",
  }
);

const AuthModel = mongoose.model("users", schema);

module.exports = AuthModel;
