const express = require("express");
const dotenv = require("dotenv").config();
const contactRoutes = require("./routes/contactRoutes");
const errorHandler = require("./middleware/errorHandler");
const connectWithDb = require("./config/dbConnection");

connectWithDb();
const app = express();

app.use(express.json());
app.use("/api/contacts", contactRoutes);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
