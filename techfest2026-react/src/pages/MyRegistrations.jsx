import { useEffect, useState } from "react";
import axios from "axios";

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    axios
      .get("http://localhost:5000/api/registrations/my", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setRegistrations(response.data);
      })
      .catch((error) => {
        setMessage(
          error.response?.data?.message ||
            "Unable to load registrations."
        );
      });
  }, []);

  if (message) {
    return (
      <div className="page">
        <h1>My Registrations</h1>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>My Registrations</h1>

      {registrations.length === 0 ? (
        <p>No registrations found.</p>
      ) : (
        registrations.map((registration) => (
          <div className="event-card" key={registration._id}>
            <h3>{registration.event.name}</h3>

            <p>
              Category: {registration.event.category}
            </p>

            <p>
              Fee:{" "}
              {registration.event.fee === 0
                ? "Free"
                : `Rs. ${registration.event.fee}`}
            </p>

            <p>
              Date:{" "}
              {new Date(
                registration.event.date
              ).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyRegistrations;