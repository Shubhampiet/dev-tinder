const app = require("./src/app");
const port = process.env.PORT || 3000;
const connectDb = require("./src/config/database");
const dotenv = require("dotenv");

dotenv.config();

// Test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

try {
  connectDb();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.error("Error connecting to the database:", error);
}
