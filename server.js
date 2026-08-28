const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// -----------------------------
// CANTEEN MENU
// -----------------------------

const menu = [
  {
    id: 1,
    name: "Biryani",
    price: 80,
    emoji: "🍗",
    available: true
  },
  {
    id: 2,
    name: "Fried Rice",
    price: 80,
    emoji: "🍚",
    available: true
  },
  {
    id: 3,
    name: "Porotta",
    price: 20,
    emoji: "🫓",
    available: true
  },
  {
    id: 4,
    name: "Puffs",
    price: 20,
    emoji: "🥐",
    available: true
  },
  {
    id: 5,
    name: "Drinks",
    price: 10,
    emoji: "🥤",
    available: true
  }
];

let orders = [];

// Get menu
app.get("/api/menu", (req, res) => {
  res.json(menu);
});

// Place order
app.post("/api/orders", (req, res) => {
  const { items, total, studentName } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      message: "Cart is empty"
    });
  }

  const order = {
    id: orders.length + 1,
    token: `CAN-${1000 + orders.length + 1}`,
    studentName: studentName || "Student",
    items,
    total,
    status: "Pending",
    createdAt: new Date()
  };

  orders.push(order);

  res.status(201).json({
    message: "Order placed successfully",
    order
  });
});

// Get orders
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// -----------------------------
// CAMPUS COMPLAINTS
// -----------------------------

let complaints = [];

app.post("/api/complaints", (req, res) => {
  const { title, description, location, studentName } = req.body;

  const complaint = {
    id: complaints.length + 1,
    title,
    description,
    location,
    studentName,
    status: "Submitted",
    createdAt: new Date()
  };

  complaints.push(complaint);

  res.status(201).json({
    message: "Complaint submitted successfully",
    complaint
  });
});

app.get("/api/complaints", (req, res) => {
  res.json(complaints);
});

// -----------------------------
// LOST & FOUND
// -----------------------------

let lostFound = [];

app.post("/api/lost-found", (req, res) => {
  const item = {
    id: lostFound.length + 1,
    ...req.body,
    status: "Available",
    createdAt: new Date()
  };

  lostFound.push(item);

  res.status(201).json({
    message: "Item posted successfully",
    item
  });
});

app.get("/api/lost-found", (req, res) => {
  res.json(lostFound);
});

// -----------------------------
// INTERNSHIPS
// -----------------------------

const internships = [
  {
    id: 1,
    company: "Tech Solutions",
    role: "Web Developer Intern",
    skills: ["React", "JavaScript", "HTML", "CSS"]
  },
  {
    id: 2,
    company: "Data Labs",
    role: "Data Analyst Intern",
    skills: ["Python", "SQL", "Excel"]
  },
  {
    id: 3,
    company: "AI Innovations",
    role: "AI Intern",
    skills: ["Python", "Machine Learning", "SQL"]
  }
];

app.get("/api/internships", (req, res) => {
  res.json(internships);
});

// -----------------------------
// SERVER
// -----------------------------

app.get("/", (req, res) => {
  res.json({
    message: "Smart Campus Hub API is running"
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
