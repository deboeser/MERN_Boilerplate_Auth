const express = require("express");
const mongoose = require("mongoose");

// Importing routes
const auth = require("./routes/api/auth");

// Initi Server and connect to MongoDB
const app = express();
const port = process.env.PORT || 5000;
const db = require("./config/keys").mongoURI;

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Defining routes
app.get("/", (req, res) => res.send("Hello"));
app.use("/api/auth", auth);

// Starting server listening
app.listen(port, () => console.log(`Server running on port ${port}`));
