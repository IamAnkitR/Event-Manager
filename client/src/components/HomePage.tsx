import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EventForm } from "./EventForm";

interface Event {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  organizer: string;
}

export const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get<Event[]>(
          "http://localhost:8080/api/v1/events"
        );
        setEvents(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Events</h1>
      <div className="flex flex-wrap md:flex-nowrap">
        <div className="w-full md:w-2/3 md:pr-4">
          <ul className="space-y-4">
            {events.map((event) => (
              <li
                key={event._id}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <h2 className="text-2xl font-semibold mb-2">{event.name}</h2>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <p className="text-gray-500">
                  Start Date: {new Date(event.startDate).toLocaleDateString()}
                </p>
                <p className="text-gray-500">
                  End Date: {new Date(event.endDate).toLocaleDateString()}
                </p>
                <p className="text-gray-500 mb-4">
                  Organizer: {event.organizer}
                </p>
                <button
                  title="Redirect to Event"
                  onClick={() => navigate(`/event/${event._id}`)}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-1/3 md:pl-4 mt-8 md:mt-0">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <EventForm />
          </div>
        </div>
      </div>
    </div>
  );
};
