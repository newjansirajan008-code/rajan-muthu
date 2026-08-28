import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [message, setMessage] = useState("");

  const [complaint, setComplaint] = useState({
    title: "",
    description: "",
    location: ""
  });

  const [lostItem, setLostItem] = useState({
    type: "Lost",
    itemName: "",
    description: "",
    location: ""
  });

  const [internships, setInternships] = useState([]);

  const [studentSkills, setStudentSkills] = useState(
    "JavaScript, React, HTML, CSS"
  );

  useEffect(() => {
    fetch("http://localhost:5000/api/menu")
      .then((res) => res.json())
      .then((data) => setMenu(data));

    fetch("http://localhost:5000/api/internships")
      .then((res) => res.json())
      .then((data) => setInternships(data));
  }, []);

  // -----------------------------
  // CART
  // -----------------------------

  function addToCart(food) {
    const existing = cart.find((item) => item.id === food.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
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

  function decreaseQuantity(id) {
    const item = cart.find((item) => item.id === id);

    if (item.quantity === 1) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      setCart(
        cart.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  }

  function increaseQuantity(id) {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // -----------------------------
  // PLACE ORDER
  // -----------------------------

  async function placeOrder() {
    if (!studentName.trim()) {
      alert("Please enter your name");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        studentName,
        items: cart,
        total
      })
    });

    const data = await response.json();

    setMessage(
      `Order placed successfully! Your token is ${data.order.token}`
    );

    setCart([]);
  }

  // -----------------------------
  // COMPLAINT
  // -----------------------------

  async function submitComplaint(e) {
    e.preventDefault();

    const response = await fetch(
      "http://localhost:5000/api/complaints",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...complaint,
          studentName
        })
      }
    );

    const data = await response.json();

    alert(data.message);

    setComplaint({
      title: "",
      description: "",
      location: ""
    });
  }

  // -----------------------------
  // LOST & FOUND
  // -----------------------------

  async function submitLostItem(e) {
    e.preventDefault();

    const response = await fetch(
      "http://localhost:5000/api/lost-found",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...lostItem,
          studentName
        })
      }
    );

    const data = await response.json();

    alert(data.message);

    setLostItem({
      type: "Lost",
      itemName: "",
      description: "",
      location: ""
    });
  }

  // -----------------------------
  // INTERNSHIP MATCHING
  // -----------------------------

  function calculateMatch(requiredSkills) {
    const skills = studentSkills
      .toLowerCase()
      .split(",")
      .map((skill) => skill.trim());

    const matched = requiredSkills.filter((skill) =>
      skills.includes(skill.toLowerCase())
    );

    return Math.round(
      (matched.length / requiredSkills.length) * 100
    );
  }

  return (
    <div className="app">

      {/* NAVBAR */}

      <header>
        <div className="logo">
          🎓 Smart Campus Hub
        </div>

        <nav>
          <button onClick={() => setPage("home")}>
            Home
          </button>

          <button onClick={() => setPage("canteen")}>
            🍱 Canteen
          </button>

          <button onClick={() => setPage("lost")}>
            🔎 Lost & Found
          </button>

          <button onClick={() => setPage("complaints")}>
            📢 Complaints
          </button>

          <button onClick={() => setPage("internships")}>
            💼 Internships
          </button>
        </nav>
      </header>

      {/* HOME */}

      {page === "home" && (
        <main className="home">

          <section className="hero">
            <h1>Smart Campus Hub</h1>

            <p>
              One smart platform for your entire college campus.
            </p>

            <button
              className="primary"
              onClick={() => setPage("canteen")}
            >
              Explore Canteen
            </button>
          </section>

          <section className="features">

            <div
              className="feature"
              onClick={() => setPage("canteen")}
            >
              <span>🍱</span>
              <h2>Smart Canteen</h2>
              <p>
                Order food and get your canteen token.
              </p>
            </div>

            <div
              className="feature"
              onClick={() => setPage("lost")}
            >
              <span>🔎</span>
              <h2>Lost & Found</h2>
              <p>
                Find or report lost items on campus.
              </p>
            </div>

            <div
              className="feature"
              onClick={() => setPage("complaints")}
            >
              <span>📢</span>
              <h2>Campus Complaints</h2>
              <p>
                Report campus problems easily.
              </p>
            </div>

            <div
              className="feature"
              onClick={() => setPage("internships")}
            >
              <span>💼</span>
              <h2>Internship Matcher</h2>
              <p>
                Find internships based on your skills.
              </p>
            </div>

          </section>

        </main>
      )}

      {/* CANTEEN */}

      {page === "canteen" && (
        <main className="page">

          <h1>🍱 Smart Canteen</h1>

          <div className="name-box">
            <input
              placeholder="Enter your name"
              value={studentName}
              onChange={(e) =>
                setStudentName(e.target.value)
              }
            />
          </div>

          <div className="canteen-layout">

            <section className="menu">

              <h2>Today's Menu</h2>

              <div className="food-grid">

                {menu.map((food) => (
                  <div className="food-card" key={food.id}>

                    <div className="food-icon">
                      {food.emoji}
                    </div>

                    <h3>{food.name}</h3>

                    <p className="price">
                      ₹{food.price}
                    </p>

                    <button
                      className="primary"
                      onClick={() => addToCart(food)}
                      disabled={!food.available}
                    >
                      Add to Cart
                    </button>

                  </div>
                ))}

              </div>

            </section>

            {/* CART */}

            <aside className="cart">

              <h2>🛒 Your Cart</h2>

              {cart.length === 0 && (
                <p>Your cart is empty.</p>
              )}

              {cart.map((item) => (
                <div className="cart-item" key={item.id}>

                  <div>
                    <strong>{item.name}</strong>
                    <p>₹{item.price} each</p>
                  </div>

                  <div className="quantity">

                    <button
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                    >
                      +
                    </button>

                  </div>

                </div>
              ))}

              <hr />

              <h2>Total: ₹{total}</h2>

              <button
                className="order-button"
                onClick={placeOrder}
              >
                Place Order
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

      {/* LOST AND FOUND */}

      {page === "lost" && (
        <main className="page">

          <h1>🔎 Lost & Found</h1>

          <div className="form-card">

            <h2>Report an Item</h2>

            <form onSubmit={submitLostItem}>

              <select
                value={lostItem.type}
                onChange={(e) =>
                  setLostItem({
                    ...lostItem,
                    type: e.target.value
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
                placeholder="Item name"
                value={lostItem.itemName}
                onChange={(e) =>
                  setLostItem({
                    ...lostItem,
                    itemName: e.target.value
                  })
                }
                required
              />

              <input
                placeholder="Location"
                value={lostItem.location}
                onChange={(e) =>
                  setLostItem({
                    ...lostItem,
                    location: e.target.value
                  })
                }
                required
              />

              <textarea
                placeholder="Description"
                value={lostItem.description}
                onChange={(e) =>
                  setLostItem({
                    ...lostItem,
                    description: e.target.value
                  })
                }
                required
              />

              <button className="primary">
                Submit Item
              </button>

            </form>

          </div>

        </main>
      )}

      {/* COMPLAINTS */}

      {page === "complaints" && (
        <main className="page">

          <h1>📢 Campus Complaint System</h1>

          <div className="form-card">

            <h2>Submit a Complaint</h2>

            <form onSubmit={submitComplaint}>

              <input
                placeholder="Complaint title"
                value={complaint.title}
                onChange={(e) =>
                  setComplaint({
                    ...complaint,
                    title: e.target.value
                  })
                }
                required
              />

              <input
                placeholder="Location"
                value={complaint.location}
                onChange={(e) =>
                  setComplaint({
                    ...complaint,
                    location: e.target.value
                  })
                }
                required
              />

              <textarea
                placeholder="Describe the problem"
                value={complaint.description}
                onChange={(e) =>
                  setComplaint({
                    ...complaint,
                    description: e.target.value
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

      {/* INTERNSHIPS */}

      {page === "internships" && (
        <main className="page">

          <h1>💼 Internship Skill Matcher</h1>

          <div className="skill-box">

            <label>
              Enter your skills separated by commas:
            </label>

            <input
              value={studentSkills}
              onChange={(e) =>
                setStudentSkills(e.target.value)
              }
              placeholder="Python, React, SQL"
            />

          </div>

          <div className="internship-grid">

            {internships.map((internship) => {

              const match = calculateMatch(
                internship.skills
              );

              return (
                <div
                  className="internship-card"
                  key={internship.id}
                >

                  <h2>{internship.role}</h2>

                  <h3>
                    {internship.company}
                  </h3>

                  <p>
                    Required Skills:
                  </p>

                  <div className="skills">

                    {internship.skills.map((skill) => (
                      <span key={skill}>
                        {skill}
                      </span>
                    ))}

                  </div>

                  <div className="match">
                    {match}% Match
                  </div>

                  {match < 100 && (
                    <p className="missing">
                      Improve your skills to increase
                      your match.
                    </p>
                  )}

                </div>
              );
            })}

          </div>

        </main>
      )}

      <footer>
        <p>
          © 2026 Smart Campus Hub | College Project
        </p>
      </footer>

    </div>
  );
}

export default App;
