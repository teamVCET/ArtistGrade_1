const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to serve static files (CSS, JS, Images)
app.use("/public", express.static(path.join(__dirname, "public")));

// Routes to render your HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/pages/index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views/pages/about.html"));
});

app.get("/contactus", (req, res) => {
  res.sendFile(path.join(__dirname, "views/pages/contactus.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views/pages/login.html"));
});

app.get("/shop", (req, res) => {
  res.sendFile(path.join(__dirname, "views/pages/shop.html"));
});

app.get("/product_details", (req, res) => {
  res.sendFile(path.join(__dirname, "views/pages/product_details.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views/pages/reg.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
