const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// 🔹 MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err));

// 🔹 User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", UserSchema);

// 🔹 File Schema
const FileSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  fileUrl: String,
  fileType: String,
  fileName: String,
  createdAt: { type: Date, default: Date.now }
});
const File = mongoose.model("File", FileSchema);

// 🔹 Multer setup
const upload = multer({ dest: "uploads/" });

// 🔹 Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// 🔹 Register
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();
    res.json({ message: "✅ Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Wrong password" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "✅ Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Upload file (protected)
app.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto"
    });
    fs.unlinkSync(req.file.path);
    const newFile = new File({
      userId: req.userId,
      fileUrl: result.secure_url,
      fileType: result.resource_type,
      fileName: req.file.originalname
    });
    await newFile.save();
    res.json({ message: "✅ Upload successful", url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get my files (protected)
app.get("/myfiles", authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ userId: req.userId });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Start server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});