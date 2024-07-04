import React, { useState } from "react";
import axios from "axios";

interface Ticket {
  title: string;
  price: number;
  quantity: number;
}

export const EventForm: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const handleAddTicket = (ticket: Ticket) => {
    setTickets([...tickets, ticket]);
  };

  const handleSaveEvent = async () => {
    try {
      const eventData = {
        name,
        description, // Add description field if needed
        startDate,
        endDate,
        organizer,
        tickets,
      };

      await axios.post("http://localhost:8080/api/v1/event/create", eventData);
      window.location.href = "/";
    } catch (err: any) {
      // Handle error
      console.error("Error saving event:", err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Create Event</h2>
      <div className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Event Name"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Event Description"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={startDate}
          placeholder="Start Date"
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={endDate}
          placeholder="End Date"
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value)}
          placeholder="Organizer"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSaveEvent}
          className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Save Event
        </button>
      </div>
    </div>
  );
};
