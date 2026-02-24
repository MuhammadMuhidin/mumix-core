require("dotenv").config();
const app = require("./app");
const logger = require("./core/logger");

app.listen(process.env.PORT || 4000, () => {
  logger.info(`Listening on port ${process.env.PORT || 4000}`);
});