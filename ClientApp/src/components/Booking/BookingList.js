import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../../styles/Booking/BookingList.css";

function ScheduleList() {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [statusDropdowns, setStatusDropdowns] = useState({});
    const [statusUpdates, setStatusUpdates] = useState({});
    const [showStatusDropdowns, setShowStatusDropdowns] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [cancellationReservationId, setCancellationReservationId] = useState("");
    const [isCancellationDialogOpen, setCancellationDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchBookings() {
            try {
                const response = await fetch("/api/bookings");
                if (response.ok) {
                    const data = await response.json();
                    setBookings(data);
                    setFilteredBookings(data);
                } else {
                    console.error("Failed to fetch bookings.");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }

        fetchBookings();
    }, []);

    const handleCancelReservation = () => {
        if (!cancellationReservationId) {
          alert("Please enter a valid Reservation ID.");
          return;
        }
      
        // Find the reservation with the given ID
        const reservationToCancel = bookings.find(
          (booking) => booking.bookingId === cancellationReservationId
        );
      
        if (!reservationToCancel) {
          alert("SORRY! Reservation not found. Please check the Reservation ID and Try Again!");
        } else {
          // Calculate the difference between the journeyDate and the current date
          const journeyDate = new Date(reservationToCancel.journeyDate);
          const currentDate = new Date();
          const timeDifference = journeyDate.getTime() - currentDate.getTime();
          const daysDifference = timeDifference / (1000 * 3600 * 24);
      
          if (daysDifference > 5) {
            // Reservation can be canceled
            // Update the reservationStatus to "Cancelled"
            const updatedReservation = {
              ...reservationToCancel,
              reservationStatus: "Cancelled",
            };
      
            // Update the reservation in the state
            setBookings((prevBookings) =>
              prevBookings.map((booking) =>
                booking.id === reservationToCancel.bookingId
                  ? updatedReservation
                  : booking
              )
            );
      
            // Close the cancellation dialog
            closeCancellationDialog();
      
            // You can also send a PUT request to update the reservation status on the server if needed
      
            alert("Reservation has been successfully cancelled.");
          } else {
            // Reservation cannot be canceled
            alert("Reservation cannot be cancelled since it has less than 5 days for the Journey.");
          }
        }
      };
      

    const openCancellationDialog = () => {
        setCancellationDialogOpen(true);
    };

    const closeCancellationDialog = () => {
        setCancellationDialogOpen(false);
    };


    const handleStatusChange = async (bookingId, newBookingStatus) => {
        try {
            // Update the statusUpdates state with the new status
            setStatusUpdates({
                ...statusUpdates,
                [bookingId]: newBookingStatus,
            });

            // Hide the status dropdown after selecting a new status
            setShowStatusDropdowns({
                ...showStatusDropdowns,
                [bookingId]: false,
            });

            // Send a PUT request to update the schedule status in the API
            const updatedBooking = {
                ...bookings.find((booking) => booking.bookingId === bookingId),
                reservationStatus: newBookingStatus,
            };

            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedBooking),
            });
            if (response.ok) {
                // Schedule status updated successfully
                console.log("Reservation status updated successfully");

                // Update the 'schedules' state with the updated status
                setBookings((prevBookings) =>
                    prevBookings.map((booking) =>
                        booking.bookingId === bookingId ? updatedBooking : booking
                    )
                );
                // // Update the assignStatus
                // updateAssignStatus(bookingId, newBookingStatus);
            } else {
                // Handle the case where the update request failed
                console.error("Failed to update reservation status");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDeleteClick = async (id) => {
        const reservationToDelete = bookings.find((booking) => booking.bookingId === id);

        if (reservationToDelete) {
            const reservationStatus = reservationToDelete.reservationStatus;

            const confirmDelete = window.confirm(
                `Are you sure you want to delete this reservation record with Reservation ID: ${id.slice(-8)}?`
            );

            if (confirmDelete && reservationStatus !== "Not completed") {
                try {
                    const response = await fetch(`/api/bookings/${id}`, {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        setBookings((prevBookings) => prevBookings.filter((booking) => booking.bookingId !== id));
                    } else {
                        console.error(`Failed to delete reservation with ID ${id}`);
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            } else if (reservationStatus === "Not completed") {
                alert("You cannot delete this reservation's details, Since it has been not completed yet");
            }
        }
    };

    const handleAddNewBooking = () => {
        navigate("/scheduleList");
    };

    const handleStatusClick = (id) => {
        // Show the status dropdown for the booking with the given ID
        setShowStatusDropdowns({
            ...showStatusDropdowns,
            [id]: true,
        });
    };

    // Format the date and time values
    const formatTime = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleSearch = (event) => {
        const searchValue = event.target.value;
        setSearchTerm(searchValue);

        // Filter the schedules based on the search term (schedule ID)
        const filtered = bookings.filter((booking) =>
            booking.bookingId.toLowerCase().includes(searchValue.toLowerCase())
        );

        setFilteredBookings(filtered);
    };

    return (
        <div className='add-background'>
            <h2>BOOKING LIST</h2>
            <div className="booking-list-container">
                <div className="booking-search">
                    <label htmlFor="search">Search Reservation ID:</label>
                    <input
                        placeholder="Enter the Reservation ID"
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div>
                    <button
                        className="add-new-booking-btn"
                        onClick={() => handleAddNewBooking()}>
                        Add New Reservation
                    </button>
                </div>
                <div>
                    <button
                        className="cancel-reservation-btn"
                        onClick={openCancellationDialog}>
                        Cancel Reservation
                    </button>
                </div>
                {isCancellationDialogOpen && (
                    <div className="cancellation-dialog">
                        <label htmlFor="cancellationReservationId">Enter Reservation ID:</label>
                        <input
                            type="text"
                            id="cancellationReservationId"
                            value={cancellationReservationId}
                            onChange={(e) => setCancellationReservationId(e.target.value)}
                        />
                        <button className="confirm-cancel-reservation-btn" onClick={handleCancelReservation}>Cancel Reservation</button>
                        <button className="confirm-close-reservation-btn" onClick={closeCancellationDialog}>Close</button>
                    </div>
                )}
                <table className="booking-table">
                    <thead>
                        <tr>
                            <th>Reservation ID</th>
                            <th>Traveler NIC</th>
                            <th>Traveler Name</th>
                            <th>Train Name</th>
                            <th>From Location</th>
                            <th>To Location</th>
                            <th>Departure Time</th>
                            <th>Arrival Time</th>
                            <th>Journey Date</th>
                            <th>Train Class</th>
                            <th>No of Passengers</th>
                            <th>Ticket Price (Per Person - Rs.)</th>
                            <th>Totala Amount (Rs.)</th>
                            <th>Reservation Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.bookingId.slice(-8)}</td>
                                <td>{booking.travelerNIC}</td>
                                <td>{booking.travelerName}</td>
                                <td>{booking.trainName}</td>
                                <td>{booking.fromLocation}</td>
                                <td>{booking.toLocation}</td>
                                <td>{formatTime(booking.departureTime)}</td>
                                <td>{formatTime(booking.arrivalTime)}</td>
                                <td>{formatDate(booking.journeyDate)}</td>
                                <td>{booking.trainClass}</td>
                                <td>{booking.numberOfPassengers}</td>
                                <td>{booking.ticketPrice}</td>
                                <td>{booking.totalAmount}</td>
                                <td>
                                    {showStatusDropdowns[booking.id] ? (
                                        <div className="status-text">
                                            <select
                                                value={statusUpdates[booking.id] || booking.reservationStatus}
                                                onChange={(e) => handleStatusChange(booking.bookingId, e.target.value)}
                                            >
                                                <option value="Not completed">Not completed</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                            <button
                                                onClick={() => handleStatusChange(booking.bookingId, statusUpdates[booking.bookingId])}
                                            >
                                                &#10003; {/* Checkmark symbol */}
                                            </button>
                                            <button onClick={() => setShowStatusDropdowns({})}>&#10005; {/* Cross symbol */}</button>
                                        </div>
                                    ) : (
                                        <div onClick={() => handleStatusClick(booking.id)}>
                                            {booking.reservationStatus}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <button className="booking-delete-btn" onClick={() => handleDeleteClick(booking.bookingId)}>DELETE</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ScheduleList;
