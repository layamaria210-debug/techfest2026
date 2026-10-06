import { useState } from "react";
import axios from "axios";

function EventCard({ event }) {
  const [seatsLeft, setSeatsLeft] = useState(event.seats);
  const [message, setMessage] = useState("");

  async function handleRegister() {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/registrations",
        {
          eventId: event._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSeatsLeft(seatsLeft - 1);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed."
      );
    }
  }

  return (
    <div className="event-card">
      <h3>{event.name}</h3>

      <p>Category: {event.category}</p>

      <p>
        Fee: {event.fee === 0 ? "Free" : `Rs. ${event.fee}`}
      </p>

      <p>Seats left: {seatsLeft}</p>

      {seatsLeft === 0 ? (
        <button disabled>SOLD OUT</button>
      ) : (
        <button onClick={handleRegister}>Register</button>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default EventCard;