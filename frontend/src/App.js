import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/custom.css";

// Home Page Component
function Home() {
  const [events, setEvents] = useState([]);
  const [success, setSuccess] = useState("");   // Success message state
  const [error, setError] = useState("");       // Error message state

  useEffect(() => {
    fetch("http://localhost:3000/events.json")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // BOOKING FUNCTION (sends POST request to Rails API)
  const handleBooking = (eventId) => {
    fetch("http://localhost:3000/bookings.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking: {
          user_id: 1,       // TEMPORARY until i add devise authentication
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
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}
      </div>

      {/* Event Cards */}
      <div className="container my-5">
        <div className="row g-4">
          {events.length > 0 ? (
            events.map((event) => (
              <div className="col-md-4" key={event.id}>
                <div className="card h-100 border-0 shadow-sm">
                  <img
                    src={`https://source.unsplash.com/600x400/?event,${event.title}`}
                    className="card-img-top"
                    alt={event.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{event.title}</h5>
                    <p className="text-muted mb-1">{event.location}</p>

                    <p>
                      Date: {new Date(event.date).toLocaleDateString()} | Time:{" "}
                      {new Date(event.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    <p className="card-text">{event.description}</p>

                    <p className="fw-semibold text-end text-success">
                      Capacity: {event.capacity}
                    </p>

                    {/* BOOK NOW BUTTON */}
                    <button
                      className="btn btn-primary w-100 mt-2"
                      onClick={() => handleBooking(event.id)}
                    >
                      Book Now
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

// Create Event Component
function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    capacity: "",
    user_id: 1,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/events.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: formData }),
    })
      .then((res) => {
        if (res.ok) {
          alert("Event created successfully!");
          navigate("/"); // redirect to homepage after successful creation
        } else {
          alert("Error creating event.");
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Create New Event</h2>
      <form className="col-md-6 mx-auto" onSubmit={handleSubmit}>

        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Location */}
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        {/* Date + Time */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Time</label>
            <input
              type="time"
              className="form-control"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Capacity */}
        <div className="mb-3">
          <label className="form-label">Capacity</label>
          <input
            type="number"
            className="form-control"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          Create Event
        </button>
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
      </Routes>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3">
        © 2025 <span>EventSys</span> — Built with Rails & React
      </footer>

    </Router>
  );
}

export default App;
