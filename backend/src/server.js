require("dotenv").config();
const app = require("./app");

app.listen(process.env.PORT || 4000, () => {
  console.log("API running on port 4000");
});