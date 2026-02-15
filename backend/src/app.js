const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.route");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use("/api/users", userRoutes);

app.use(errorHandler);

module.exports = app;