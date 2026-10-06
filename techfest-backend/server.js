require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/events", require("./Routes/events"));
app.use("/api/users", require("./Routes/users"));
app.use("/api/registrations", require("./Routes/registrations"));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB error:", err.message));

// Start server
app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});