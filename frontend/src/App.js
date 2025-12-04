import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/custom.css";
// using env variable for backend URL (learned from React labs)
// updated default to Render backend for production deploy
const API_URL = process.env.REACT_APP_API_URL || "https://eventmanagement-backend-y0z3.onrender.com";

// Home Page Component
function Home() {
  const [events, setEvents] = useState([]);
  const [success, setSuccess] = useState("");   // Success message state
  const [error, setError] = useState("");       // Error message state

  useEffect(() => {
    // Updated from localhost to env variable
    fetch(`${API_URL}/events.json`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // DELETE event
  const handleDelete = (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    fetch(`${API_URL}/events/${eventId}.json`, {
      method: "DELETE"
    })
      .then((res) => {
        if (res.ok) {
          setEvents(events.filter((e) => e.id !== eventId));
          setSuccess("Event deleted successfully.");
        } else {
          setError("Error deleting event.");
        }
      })
      .catch((err) => setError("Network error: " + err.message));
  };

  // BOOKING FUNCTION (sends POST request to Rails API)
  const handleBooking = (eventId) => {
    // localhost to env variable
    fetch(`${API_URL}/bookings.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking: {
          user_id: 1,       // temporary static user id for demo since Devise was removed
          event_id: eventId,
          status: "confirmed"
        }
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          setError("Booking failed: " + JSON.stringify(errData));
        } else {
          setSuccess("Booking confirmed!");
        }
      })
      .catch((err) => {
        setError("Network error: " + err.message);
      });
  };

  // EMAIL CONFIRMATION FUNCTION (sends POST request to Rails EmailController)
  const handleSendConfirmation = (eventId) => {
    fetch(`${API_URL}/send_confirmation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: 1,  // same static user as booking
        event_id: eventId
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError("Email failed: " + data.error);
        } else {
          setSuccess(data.message || "Confirmation email sent.");
        }
      })
      .catch((err) => {
        setError("Network error: " + err.message);
      });
  };

  return (
    <div>
      {/* Hero Section */}
      <header className="bg-light text-center py-5 shadow-sm">
        <h1 className="fw-bold">Discover & Manage Events</h1>
        <p className="lead text-muted">
          Your all-in-one platform to create, book, and explore events.
        </p>
      </header>

      {/* Success / Error Alerts */}
      <div className="container mt-3">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
      </div>

      {/* Event Cards */}
      <div className="container my-5">
        <div className="row g-4">
          {events.length > 0 ? (
            events.map((event) => (
              <div className="col-md-4" key={event.id}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{event.title}</h5>
                    <p className="text-muted mb-1">{event.location}</p>

                    <p>
                      Date: {new Date(event.date).toLocaleDateString()} | Time:{" "}
                      {new Date(event.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>

                    <p className="card-text">{event.description}</p>

                    <p className="fw-semibold text-end text-success">
                      Capacity: {event.capacity}
                    </p>

                    {/* CRUD BUTTONS */}
                    <div className="d-flex justify-content-between mt-2">
                      <Link className="btn btn-outline-primary btn-sm" to={`/events/${event.id}`}>
                        View
                      </Link>

                      <Link className="btn btn-outline-warning btn-sm" to={`/events/${event.id}/edit`}>
                        Edit
                      </Link>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(event.id)}
                      >
                        Delete
                      </button>
                    </div>

                    {/* BOOK NOW BUTTON */}
                    <button
                      className="btn btn-primary w-100 mt-3"
                      onClick={() => handleBooking(event.id)}
                    >
                      Book Now
                    </button>

                    {/* SEND CONFIRMATION EMAIL BUTTON */}
                    <button
                      className="btn btn-secondary w-100 mt-2"
                      onClick={() => handleSendConfirmation(event.id)}
                    >
                      Send Confirmation Email
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">
              <h4 className="text-muted">No events available</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// View (Show) Event Component
function ShowEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // following labs for fetch by ID
    fetch(`${API_URL}/events/${id}.json`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!event) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container my-5">
      <h2 className="mb-3">{event.title}</h2>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Time:</strong> {event.time}</p>
      <p><strong>Capacity:</strong> {event.capacity}</p>

      <Link className="btn btn-warning me-2" to={`/events/${event.id}/edit`}>
        Edit
      </Link>
      <Link className="btn btn-secondary" to="/">Back</Link>
    </div>
  );
}

// Edit Event Component
function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/events/${id}.json`)
      .then((res) => res.json())
      .then((data) => setForm(data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!form) return <p className="text-center mt-5">Loading...</p>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/events/${id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: form })
    }).then((res) => {
      if (res.ok) {
        navigate(`/events/${id}`);
      } else {
        alert("Error updating event.");
      }
    });
  };

  return (
    <div className="container my-5">
      <h2>Edit Event</h2>

      <form className="col-md-6 mx-auto" onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-3"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          className="form-control mb-3"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className="form-control mb-3"
          name="location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <div className="row mb-3">
          <div className="col">
            <input
              type="date"
              className="form-control"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="time"
              className="form-control"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <input
          type="number"
          className="form-control mb-3"
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
          required
        />

        <button className="btn btn-success w-100">Save Changes</button>
      </form>
    </div>
  );
}

function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    capacity: ""
  });

  const handleChange = (e) => {
    // following labs for controlled forms
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/events.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: form })
    })
      .then((res) => {
        if (res.ok) {
          navigate("/");
        } else {
          alert("Error creating event.");
        }
      })
      .catch((err) => console.log("Network error:", err));
  };

  return (
    <div className="container my-5">
      <h2>Create Event</h2>

      <form className="col-md-6 mx-auto" onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-3"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          className="form-control mb-3"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          className="form-control mb-3"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <div className="row mb-3">
          <div className="col">
            <input
              type="date"
              className="form-control"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="time"
              className="form-control"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <input
          type="number"
          className="form-control mb-3"
          name="capacity"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
          required
        />

        <button className="btn btn-success w-100">Create Event</button>
      </form>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            EventSys
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/create">
                  Create Event
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/events/:id" element={<ShowEvent />} />
        <Route path="/events/:id/edit" element={<EditEvent />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3">
        © 2025 <span>EventSys</span> — Built with Rails & React by Aaron Goslin
      </footer>

    </Router>
  );
}

export default App;
