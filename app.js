const express = require("express");
const path = require("path");
const session = require("express-session");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

// Session middleware
app.use(session({
  secret: "yourSecretKey",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Helper function to serve HTML files
const renderPage = (res, filePath, data = {}) => {
  const fullPath = path.join(__dirname, "views/pages", filePath);

  // If error message passed, inject it into page
  if (data.error) {
    fs.readFile(fullPath, "utf8", (err, content) => {
      if (err) return res.status(500).send("Error loading page");
      content = content.replace("<!-- ERROR_MESSAGE -->", `<div class="text-danger text-center mb-3">${data.error}</div>`);
      res.send(content);
    });
  } else {
    res.sendFile(fullPath);
  }
};

// Admin authentication middleware
const adminAuth = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};

// ----------------- Public Routes -----------------
app.get("/", (req, res) => renderPage(res, "index.html"));
app.get("/about", (req, res) => renderPage(res, "about.html"));
app.get("/contactus", (req, res) => renderPage(res, "contactus.html"));
app.get("/login", (req, res) => renderPage(res, "login.html"));
app.get("/shop", (req, res) => renderPage(res, "shop.html"));
app.get("/product_details", (req, res) => renderPage(res, "product_details.html"));
app.get("/register", (req, res) => renderPage(res, "reg.html"));

// ----------------- Admin Routes -----------------
app.get("/admin/login", (req, res) => renderPage(res, "adminpanel/adminlogin.html"));

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  // Simple hardcoded authentication
  if (username === "admin" && password === "admin123") {
    req.session.adminLoggedIn = true;
    res.redirect("/admin/dashboard");
  } else {
    renderPage(res, "adminpanel/adminlogin.html", { error: "❌ Invalid username or password" });
  }
});

app.get("/admin/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

// ----------------- Protected Admin Pages -----------------
app.get("/admin/dashboard", adminAuth, (req, res) => renderPage(res, "adminpanel/dashboard.html"));
app.get("/admin/orders", adminAuth, (req, res) => renderPage(res, "adminpanel/orders.html"));
app.get("/admin/products", adminAuth, (req, res) => renderPage(res, "adminpanel/products.html"));
app.get("/admin/users", adminAuth, (req, res) => renderPage(res, "adminpanel/users.html"));

// ----------------- Start Server -----------------
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
