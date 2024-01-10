const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const dbConfig = require("./config/db");

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

dbConfig;

app.use("/auth", authRoutes);

app.listen(port, () => {
});
