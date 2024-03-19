const express = require("express");
const dotenv = require("dotenv").config();
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes")
const errorHandler = require("./middleware/errorHandler");
const connectWithDb = require("./config/dbConnection");
var cors = require("cors");

connectWithDb();
const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes)
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
