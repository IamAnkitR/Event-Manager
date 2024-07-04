import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ObjectId } from "bson";

interface Ticket {
  _id: string;
  ticketId: string;
  ticketNumber: string;
  price: string;
  new?: boolean;
}

interface Event {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  organizer: string;
  tickets: Ticket[];
}

export const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [ticketsArray, setTicketsArray] = useState<Ticket[]>([]);
  const [newTicket, setNewTicket] = useState<Ticket>({
    _id: "",
    ticketId: "",
    ticketNumber: "",
    price: "",
  });
  const [deletedTickets, setDeletedTickets] = useState<string[]>([]);
  const [editMode, setEditMode] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/event/${eventId}`
        );
        setEvent(response.data);
        setTicketsArray(response.data.tickets);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    console.log("Tickets Array:", ticketsArray);
  }, [ticketsArray]);

  const handleSaveClick = () => {
    try {
      if (!newTicket.ticketNumber || !newTicket.price) {
        alert("Please fill out both fields");
        return;
      }

      if (newTicket?.ticketNumber && newTicket?.price) {
        if (event) {
          const newTicketObject = {
            _id: String(new ObjectId()),
            ticketId: (event?.tickets.length + 1).toString(),
            ticketNumber: newTicket.ticketNumber,
            price: newTicket.price,
            eventId: event?._id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            new: true,
            __v: 0,
          };
          setTicketsArray([...ticketsArray, newTicketObject]);
          setEvent({
            ...event,
            tickets: [...event.tickets, newTicketObject],
          });
          setNewTicket({ _id: "", ticketId: "", ticketNumber: "", price: "" });
        }
      }
    } catch (error: any) {
      console.error("Error adding ticket: ", error.message);
    }
  };

  const handleAddTicket = () => {
    try {
      setNewTicket({ _id: "", ticketId: "", ticketNumber: "", price: "" });
      setIsAdding(!isAdding);
    } catch (error: any) {
      console.error("Error adding ticket: ", error.message);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      const newTicketArray = ticketsArray?.filter(
        (ticket) => ticket._id !== ticketId
      );
      setTicketsArray(newTicketArray);
      setDeletedTickets([...deletedTickets, ticketId]);
    } catch (error: any) {
      console.error("Error deleting ticket: ", error.message);
    }
  };

  const handleSaveTicket = async (ticketId: string) => {
    await handleEditTicket(ticketId);
    setEditMode(null); // Turn off edit mode after saving
    window.location.reload();
  };

  const handleEditTicket = async (ticketId: string) => {
    try {
      const updatedTicket = {
        ticketNumber: newTicket.ticketNumber,
        price: newTicket.price,
      };

      const response = await axios.put(
        `http://localhost:8080/api/v1/ticket/${ticketId}`,
        updatedTicket
      );
      const updatedTickets = ticketsArray.map((ticket) =>
        ticket._id === response.data.ticket._id ? response.data.ticket : ticket
      );
      setTicketsArray(updatedTickets);
      setEditMode(null);
    } catch (error: any) {
      console.error("Error editing ticket: ", error.message);
    }
  };

  const handleSaveEvent = async () => {
    try {
      const temp = ticketsArray.filter((ticket) => {
        return ticket?.new === true;
      });

      if (event) {
        event.tickets = temp;
      }

      if (deletedTickets.length > 0) {
        for (const ticketId of deletedTickets) {
          await axios.delete(`http://localhost:8080/api/v1/ticket/${ticketId}`);
        }
      }

      await axios.put(`http://localhost:8080/api/v1/event/${eventId}`, event);

      window.location.reload();
    } catch (err: any) {
      console.error("Error saving event: ", err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Event Details</h1>
      <div className="space-y-4">
        <div className="flex items-center">
          <label htmlFor="eventName" className="w-32">
            Event Name
          </label>
          <input
            type="text"
            id="eventName"
            value={event.name}
            onChange={(e) => setEvent({ ...event, name: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="w-32">
            Event Description
          </label>
          <textarea
            value={event.description}
            id="description"
            onChange={(e) =>
              setEvent({ ...event, description: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label htmlFor="startDate" className="w-32">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={new Date(event.startDate).toISOString().split("T")[0]}
              onChange={(e) =>
                setEvent({
                  ...event,
                  startDate: new Date(e.target.value).toISOString(),
                })
              }
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="endDate" className="w-32">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={new Date(event.endDate).toISOString().split("T")[0]}
              onChange={(e) =>
                setEvent({
                  ...event,
                  endDate: new Date(e.target.value).toISOString(),
                })
              }
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center">
          <label htmlFor="organizer" className="w-32">
            Organizer
          </label>
          <input
            type="text"
            id="organizer"
            value={event.organizer}
            onChange={(e) => setEvent({ ...event, organizer: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="w-32">Tickets</label>
            <button
              onClick={handleAddTicket}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Add new ticket
            </button>
          </div>
          {isAdding && (
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Ticket Number"
                value={newTicket.ticketNumber}
                onChange={(e) => {
                  setNewTicket({ ...newTicket, ticketNumber: e.target.value });
                }}
                className="border border-gray-300 rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Price"
                value={newTicket.price}
                onChange={(e) => {
                  setNewTicket({ ...newTicket, price: e.target.value });
                }}
                className="border border-gray-300 rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSaveClick}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Save
              </button>
            </div>
          )}
          {/* <ul className="space-y-2">
            {ticketsArray?.map((ticket, index) => (
              <li
                key={ticket._id}
                className="bg-white shadow-lg rounded-lg p-4 flex items-center justify-between"
              >
                {editMode === ticket._id ? ( // Check if current ticket is in edit mode
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      placeholder="Ticket Number"
                      value={newTicket.ticketNumber}
                      onChange={(e) =>
                        setNewTicket({
                          ...newTicket,
                          ticketNumber: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Price"
                      value={newTicket.price}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, price: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <div>
                    <span className="text-gray-600">ID: {index + 1}</span>
                    <span className="text-gray-600 ml-4">
                      Ticket No: {ticket.ticketNumber}
                    </span>
                    <span className="text-gray-600 ml-4">
                      Price: {ticket.price}
                    </span>
                  </div>
                )}
                <div className="space-x-2">
                  {editMode === ticket._id ? ( // Toggle edit and save button
                    <button
                      onClick={() => handleSaveTicket(ticket._id)}
                      className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditMode(ticket._id)} // Activate edit mode for this ticket
                      className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTicket(ticket._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition-colors duration-300"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul> */}
          <table className="min-w-full bg-white mx-auto">
            <thead>
              <tr>
                <th className="py-2 text-center">ID</th>
                <th className="py-2 text-center">Ticket No</th>
                <th className="py-2 text-center">Price</th>
                <th className="py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ticketsArray.map((ticket, index) => (
                <tr key={ticket._id} className="bg-gray-100 border-b">
                  <td className="py-2 text-center">{index + 1}</td>
                  <td className="py-2 text-center">
                    {editMode === ticket._id ? (
                      <input
                        type="text"
                        placeholder="Ticket Number"
                        value={newTicket.ticketNumber}
                        onChange={(e) =>
                          setNewTicket({
                            ...newTicket,
                            ticketNumber: e.target.value,
                          })
                        }
                        className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span>{ticket.ticketNumber}</span>
                    )}
                  </td>
                  <td className="py-2 text-center">
                    {editMode === ticket._id ? (
                      <input
                        type="text"
                        placeholder="Price"
                        value={newTicket.price}
                        onChange={(e) =>
                          setNewTicket({ ...newTicket, price: e.target.value })
                        }
                        className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span>{ticket.price}</span>
                    )}
                  </td>
                  <td className="py-2 text-center">
                    {editMode === ticket._id ? (
                      <button
                        onClick={() => handleSaveTicket(ticket._id)}
                        className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditMode(ticket._id)} // Activate edit mode for this ticket
                        className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTicket(ticket._id)}
                      className="bg-red-500 text-white py-1 px-3 ml-6 rounded-lg hover:bg-red-700 transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={handleSaveEvent}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Save Event
        </button>
      </div>
    </div>
  );
};
