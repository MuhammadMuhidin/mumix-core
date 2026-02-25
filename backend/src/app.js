const cookieParser = require("cookie-parser");
const session = require("express-session");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const userRoutes = require("./modules/user/user.route");
const authRoutes = require("./modules/auth/auth.route");
const { errorHandler } = require("./middlewares/error");
const { setCSRFCookie, verifyCSRF } = require("./middlewares/csrf");
const reqestLogger = require("./middlewares/requestLogger");

const app = express();

app.set("trust proxy", 1);
app.use(cookieParser());
app.use(helmet());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(reqestLogger);
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use(setCSRFCookie);
app.use(verifyCSRF);

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use(errorHandler);

module.exports = app;