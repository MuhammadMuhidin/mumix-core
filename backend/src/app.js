const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const userRoutes = require("./modules/user/user.route");
const authRoutes = require("./modules/auth/auth.route");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(errorHandler);

app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);

module.exports = app;