const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ===============================
// SMART CANTEEN MENU
// ===============================

const menu = [
  {
    id: 1,
    name: "Biryani",
    price: 80,
    category: "Main Food",
    emoji: "🍗",
    available: true
  },
  {
    id: 2,
    name: "Fried Rice",
    price: 80,
    category: "Main Food",
    emoji: "🍚",
    available: true
  },
  {
    id: 3,
    name: "Porotta",
    price: 20,
    category: "Main Food",
    emoji: "🫓",
    available: true
  },
  {
    id: 4,
    name: "Puffs",
    price: 20,
    category: "Snacks",
    emoji: "🥐",
    available: true
  },
  {
    id: 5,
    name: "Drinks",
    price: 10,
    category: "Drinks",
    emoji: "🥤",
    available: true
  },

  // Variety Rice
  {
    id: 6,
    name: "Lemon Rice",
    price: 30,
    category: "Variety Rice",
    emoji: "🍋",
    available: true
  },
  {
    id: 7,
    name: "Tomato Rice",
    price: 30,
    category: "Variety Rice",
    emoji: "🍅",
    available: true
  },
  {
    id: 8,
    name: "Curd Rice",
    price: 25,
    category: "Variety Rice",
    emoji: "🥣",
    available: true
  },
  {
    id: 9,
    name: "Coconut Rice",
    price: 30,
    category: "Variety Rice",
    emoji: "🥥",
    available: true
  },
  {
    id: 10,
    name: "Tamarind Rice",
    price: 30,
    category: "Variety Rice",
    emoji: "🍚",
    available: true
  },
  {
    id: 11,
    name: "Veg Rice",
    price: 40,
    category: "Variety Rice",
    emoji: "🥗",
    available: true
  }
];

// ===============================
// ORDERS
// ===============================

let orders = [];

// Get menu
app.get("/api/menu", (req, res) => {
  res.json(menu);
});

// Place order
app.post("/api/orders", (req, res) => {
  const {
    studentName,
    phone,
    items,
    total,
    orderType
  } = req.body;

  if (!studentName) {
    return res.status(400).json({
      message: "Student name is required"
    });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({
      message: "Cart is empty"
    });
  }

  const order = {
    id: orders.length + 1,

    // Example: SC-1001
    token: `SC-${1000 + orders.length + 1}`,

    studentName,
    phone: phone || "",
    items,
    total,
    orderType: orderType || "Take Away",

    status: "Pending",

    createdAt: new Date()
  };

  orders.push(order);

  res.status(201).json({
    message: "Order placed successfully!",
    order
  });
});

// Get all orders
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// Update order status
app.put("/api/orders/:id", (req, res) => {
  const order = orders.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!order) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  order.status = req.body.status;

  res.json({
    message: "Order status updated",
    order
  });
});

// ===============================
// CAMPUS COMPLAINT
// ===============================

let complaints = [];

app.post("/api/complaints", (req, res) => {
  const complaint = {
    id: complaints.length + 1,
    ...req.body,
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

// ===============================
// LOST & FOUND
// ===============================

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

// ===============================
// INTERNSHIPS
// ===============================

const internships = [
  {
    id: 1,
    company: "Tech Solutions",
    role: "Web Developer Intern",
    skills: [
      "React",
      "JavaScript",
      "HTML",
      "CSS"
    ]
  },

  {
    id: 2,
    company: "Data Labs",
    role: "Data Analyst Intern",
    skills: [
      "Python",
      "SQL",
      "Excel"
    ]
  },

  {
    id: 3,
    company: "AI Innovations",
    role: "AI Intern",
    skills: [
      "Python",
      "Machine Learning",
      "SQL"
    ]
  }
];

app.get("/api/internships", (req, res) => {
  res.json(internships);
});

// ===============================
// SERVER
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "Smart Campus Hub API is running"
  });
});

app.listen(PORT, () => {
  console.log(
    `Smart Campus Hub backend running on http://localhost:${PORT}`
  );
});
