import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api";

function App() {

  const [page, setPage] = useState("home");

  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  const [studentName, setStudentName] = useState("");
  const [phone, setPhone] = useState("");

  const [orderType, setOrderType] =
    useState("Take Away");

  const [message, setMessage] = useState("");

  const [category, setCategory] =
    useState("All");

  const [orders, setOrders] = useState([]);

  // Complaint
  const [complaint, setComplaint] = useState({
    title: "",
    description: "",
    location: ""
  });

  // Lost & Found
  const [lostItem, setLostItem] = useState({
    type: "Lost",
    itemName: "",
    description: "",
    location: ""
  });

  // Internship
  const [internships, setInternships] =
    useState([]);

  const [studentSkills, setStudentSkills] =
    useState(
      "JavaScript, React, HTML, CSS"
    );

  // =====================================
  // LOAD DATA
  // =====================================

  useEffect(() => {

    fetch(`${API}/menu`)
      .then((res) => res.json())
      .then((data) => setMenu(data));

    fetch(`${API}/internships`)
      .then((res) => res.json())
      .then((data) => setInternships(data));

  }, []);

  // =====================================
  // CART
  // =====================================

  function addToCart(food) {

    const existing = cart.find(
      (item) => item.id === food.id
    );

    if (existing) {

      setCart(
        cart.map((item) =>
          item.id === food.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1
              }
            : item
        )
      );

    } else {

      setCart([
        ...cart,
        {
          ...food,
          quantity: 1
        }
      ]);

    }
  }

  function increaseQuantity(id) {

    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1
            }
          : item
      )
    );
  }

  function decreaseQuantity(id) {

    const item = cart.find(
      (item) => item.id === id
    );

    if (!item) return;

    if (item.quantity === 1) {

      setCart(
        cart.filter(
          (item) => item.id !== id
        )
      );

    } else {

      setCart(
        cart.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1
              }
            : item
        )
      );
    }
  }

  function removeItem(id) {

    setCart(
      cart.filter(
        (item) => item.id !== id
      )
    );
  }

  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.price *
        item.quantity,
    0
  );

  // =====================================
  // PLACE ORDER
  // =====================================

  async function placeOrder() {

    if (!studentName.trim()) {
      alert("Please enter your name");
      return;
    }

    if (cart.length === 0) {
      alert("Please add food to cart");
      return;
    }

    const response =
      await fetch(`${API}/orders`, {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          studentName,

          phone,

          items: cart,

          total,

          orderType

        })
      });

    const data =
      await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    setMessage(
      `Order successful! Your token is ${data.order.token}`
    );

    setCart([]);

    setStudentName("");

    setPhone("");
  }

  // =====================================
  // LOAD ORDERS
  // =====================================

  async function loadOrders() {

    const response =
      await fetch(`${API}/orders`);

    const data =
      await response.json();

    setOrders(data);

    setPage("orders");
  }

  // =====================================
  // COMPLAINT
  // =====================================

  async function submitComplaint(e) {

    e.preventDefault();

    const response =
      await fetch(`${API}/complaints`, {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          ...complaint,
          studentName
        })

      });

    const data =
      await response.json();

    alert(data.message);

    setComplaint({
      title: "",
      description: "",
      location: ""
    });
  }

  // =====================================
  // LOST FOUND
  // =====================================

  async function submitLostItem(e) {

    e.preventDefault();

    const response =
      await fetch(`${API}/lost-found`, {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          ...lostItem,
          studentName
        })

      });

    const data =
      await response.json();

    alert(data.message);

    setLostItem({
      type: "Lost",
      itemName: "",
      description: "",
      location: ""
    });
  }

  // =====================================
  // INTERNSHIP MATCH
  // =====================================

  function calculateMatch(
    requiredSkills
  ) {

    const skills =
      studentSkills
        .toLowerCase()
        .split(",")
        .map(
          (skill) =>
            skill.trim()
        );

    const matched =
      requiredSkills.filter(
        (skill) =>
          skills.includes(
            skill.toLowerCase()
          )
      );

    return Math.round(
      (matched.length /
        requiredSkills.length) *
        100
    );
  }

  // =====================================
  // FILTER MENU
  // =====================================

  const filteredMenu =
    category === "All"
      ? menu
      : menu.filter(
          (food) =>
            food.category ===
            category
        );

  // =====================================
  // UI
  // =====================================

  return (

    <div className="app">

      {/* NAVBAR */}

      <header>

        <div className="logo">
          🎓 Smart Campus Hub
        </div>

        <nav>

          <button
            onClick={() =>
              setPage("home")
            }
          >
            Home
          </button>

          <button
            onClick={() =>
              setPage("canteen")
            }
          >
            🍱 Canteen
          </button>

          <button
            onClick={() =>
              setPage("lost")
            }
          >
            🔎 Lost & Found
          </button>

          <button
            onClick={() =>
              setPage("complaints")
            }
          >
            📢 Complaints
          </button>

          <button
            onClick={() =>
              setPage("internships")
            }
          >
            💼 Internships
          </button>

          <button
            onClick={loadOrders}
          >
            🧾 Orders
          </button>

        </nav>

      </header>

      {/* ================= HOME ================= */}

      {page === "home" && (

        <main className="home">

          <section className="hero">

            <h1>
              Smart Campus Hub
            </h1>

            <p>
              Smart solutions for
              your college campus
            </p>

            <button
              className="primary"
              onClick={() =>
                setPage("canteen")
              }
            >
              🍱 Order Food
            </button>

          </section>

          <section className="features">

            <div
              className="feature"
              onClick={() =>
                setPage("canteen")
              }
            >
              <span>🍱</span>

              <h2>
                Smart Canteen
              </h2>

              <p>
                Order food easily
                and get your token.
              </p>

            </div>

            <div
              className="feature"
              onClick={() =>
                setPage("lost")
              }
            >
              <span>🔎</span>

              <h2>
                Lost & Found
              </h2>

              <p>
                Find lost items
                around campus.
              </p>

            </div>

            <div
              className="feature"
              onClick={() =>
                setPage("complaints")
              }
            >
              <span>📢</span>

              <h2>
                Complaints
              </h2>

              <p>
                Report campus
                problems.
              </p>

            </div>

            <div
              className="feature"
              onClick={() =>
                setPage("internships")
              }
            >
              <span>💼</span>

              <h2>
                Internship Matcher
              </h2>

              <p>
                Find internships
                based on skills.
              </p>

            </div>

          </section>

        </main>

      )}

      {/* ================= CANTEEN ================= */}

      {page === "canteen" && (

        <main className="page">

          <h1>
            🍱 Smart Canteen
          </h1>

          {/* CUSTOMER */}

          <section className="customer-box">

            <h2>
              Customer Details
            </h2>

            <input
              placeholder="Student Name"
              value={studentName}
              onChange={(e) =>
                setStudentName(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
            />

            <select
              value={orderType}
              onChange={(e) =>
                setOrderType(
                  e.target.value
                )
              }
            >

              <option>
                Take Away
              </option>

              <option>
                Eat at Canteen
              </option>

            </select>

          </section>

          {/* CATEGORY */}

          <div className="categories">

            {[
              "All",
              "Main Food",
              "Variety Rice",
              "Snacks",
              "Drinks"
            ].map(
              (item) => (

                <button
                  key={item}
                  className={
                    category === item
                      ? "category active"
                      : "category"
                  }
                  onClick={() =>
                    setCategory(item)
                  }
                >
                  {item}
                </button>

              )
            )}

          </div>

          <div className="canteen-layout">

            {/* MENU */}

            <section>

              <h2>
                Today's Menu
              </h2>

              <div className="food-grid">

                {filteredMenu.map(
                  (food) => (

                    <div
                      className="food-card"
                      key={food.id}
                    >

                      <div className="food-icon">
                        {food.emoji}
                      </div>

                      <h3>
                        {food.name}
                      </h3>

                      <p className="category-text">
                        {food.category}
                      </p>

                      <p className="price">
                        ₹{food.price}
                      </p>

                      <button
                        className="primary"
                        onClick={() =>
                          addToCart(food)
                        }
                      >
                        ➕ Add
                      </button>

                    </div>

                  )
                )}

              </div>

            </section>

            {/* CART */}

            <aside className="cart">

              <h2>
                🛒 Your Order
              </h2>

              {cart.length === 0 && (

                <p>
                  Your cart is empty.
                </p>

              )}

              {cart.map(
                (item) => (

                  <div
                    className="cart-item"
                    key={item.id}
                  >

                    <div>

                      <strong>
                        {item.name}
                      </strong>

                      <p>
                        ₹{item.price} ×{" "}
                        {item.quantity}
                      </p>

                    </div>

                    <div className="quantity">

                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item.id
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            item.id
                          )
                        }
                      >
                        +
                      </button>

                      <button
                        className="delete"
                        onClick={() =>
                          removeItem(
                            item.id
                          )
                        }
                      >
                        🗑️
                      </button>

                    </div>

                  </div>

                )
              )}

              <hr />

              <div className="total">

                <span>
                  Total
                </span>

                <strong>
                  ₹{total}
                </strong>

              </div>

              <button
                className="order-button"
                onClick={placeOrder}
              >
                ✅ Place Order
              </button>

              {message && (

                <div className="success">

                  {message}

                </div>

              )}

            </aside>

          </div>

        </main>

      )}

      {/* ================= ORDERS ================= */}

      {page === "orders" && (

        <main className="page">

          <h1>
            🧾 Canteen Orders
          </h1>

          {orders.length === 0 && (
            <div className="empty">
              No orders yet.
            </div>
          )}

          {orders.map(
            (order) => (

              <div
                className="order-card"
                key={order.id}
              >

                <div>

                  <h2>
                    Token: {order.token}
                  </h2>

                  <p>
                    Student:{" "}
                    {order.studentName}
                  </p>

                  <p>
                    Order Type:{" "}
                    {order.orderType}
                  </p>

                </div>

                <div>

                  {order.items.map(
                    (item) => (

                      <p key={item.id}>
                        {item.name} ×{" "}
                        {item.quantity}
                      </p>

                    )
                  )}

                </div>

                <h2>
                  ₹{order.total}
                </h2>

                <div className="status">

                  Status:{" "}
                  <strong>
                    {order.status}
                  </strong>

                </div>

              </div>

            )
          )}

        </main>

      )}

      {/* ================= LOST FOUND ================= */}

      {page === "lost" && (

        <main className="page">

          <h1>
            🔎 Lost & Found
          </h1>

          <div className="form-card">

            <h2>
              Report an Item
            </h2>

            <form
              onSubmit={
                submitLostItem
              }
            >

              <select
                value={
                  lostItem.type
                }
                onChange={(e) =>
                  setLostItem({
                    ...lostItem,
                    type:
                      e.target.value
                  })
                }
              >

                <option value="Lost">
                  I Lost Something
                </option>

                <option value="Found">
                  I Found Something
                </option>

              </select>

              <input
                placeholder="Item Name"
                value={
                  lostItem.itemName
                }
                onChange={(e) =>
                  setLostItem({
                    ...lostItem,
                    itemName:
                      e.target.value
                  })
                }
                required
              />

              <input
                placeholder="Location"
                value={
                  lostItem.location
                }
                onChange={(e) =>
                  setLostItem({
                    ...lostItem,
                    location:
                      e.target.value
                  })
                }
                required
              />

              <textarea
                placeholder="Description"
                value={
                  lostItem.description
                }
                onChange={(e) =>
                  setLostItem({
                    ...lostItem,
                    description:
                      e.target.value
                  })
                }
                required
              />

              <button className="primary">
                Submit
              </button>

            </form>

          </div>

        </main>

      )}

      {/* ================= COMPLAINT ================= */}

      {page === "complaints" && (

        <main className="page">

          <h1>
            📢 Campus Complaints
          </h1>

          <div className="form-card">

            <h2>
              Submit Complaint
            </h2>

            <form
              onSubmit={
                submitComplaint
              }
            >

              <input
                placeholder="Complaint Title"
                value={
                  complaint.title
                }
                onChange={(e) =>
                  setComplaint({
                    ...complaint,
                    title:
                      e.target.value
                  })
                }
                required
              />

              <input
                placeholder="Location"
                value={
                  complaint.location
                }
                onChange={(e) =>
                  setComplaint({
                    ...complaint,
                    location:
                      e.target.value
                  })
                }
                required
              />

              <textarea
                placeholder="Describe the problem"
                value={
                  complaint.description
                }
                onChange={(e) =>
                  setComplaint({
                    ...complaint,
                    description:
                      e.target.value
                  })
                }
                required
              />

              <button className="primary">
                Submit Complaint
              </button>

            </form>

          </div>

        </main>

      )}

      {/* ================= INTERNSHIPS ================= */}

      {page === "internships" && (

        <main className="page">

          <h1>
            💼 Internship Matcher
          </h1>

          <div className="skill-box">

            <label>
              Your Skills
            </label>

            <input
              value={
                studentSkills
              }
              onChange={(e) =>
                setStudentSkills(
                  e.target.value
                )
              }
              placeholder="Python, React, SQL"
            />

          </div>

          <div className="internship-grid">

            {internships.map(
              (internship) => {

                const match =
                  calculateMatch(
                    internship.skills
                  );

                return (

                  <div
                    className="internship-card"
                    key={internship.id}
                  >

                    <h2>
                      {internship.role}
                    </h2>

                    <h3>
                      {internship.company}
                    </h3>

                    <p>
                      Required Skills
                    </p>

                    <div className="skills">

                      {internship.skills.map(
                        (skill) => (

                          <span key={skill}>
                            {skill}
                          </span>

                        )
                      )}

                    </div>

                    <div className="match">

                      {match}% Match

                    </div>

                  </div>

                );
              }
            )}

          </div>

        </main>

      )}

      <footer>

        <p>
          © 2026 Smart Campus Hub
        </p>

      </footer>

    </div>
  );
}

export default App;
