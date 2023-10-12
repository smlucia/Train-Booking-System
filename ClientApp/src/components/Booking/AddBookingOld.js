import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddBooking() {
    const [nic, setNic] = useState("");
    const [journeyDate, setJourneyDate] = useState("");
    const [fromLocation, setFromLocation] = useState("");
    const [toLocation, setToLocation] = useState("");
    const [noOfPassengers, setNoOfPassengers] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isTraveler, setIsTraveler] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async () => {
        try {
            if (!nic || !journeyDate || !fromLocation || !toLocation || !noOfPassengers) {
                // Handle validation errors
                return;
            }
    
            // Check if the user is a registered traveler
            const travelerCheckResponse = await fetch(`/api/traveler/check?nic=${nic}`);
            if (!travelerCheckResponse.ok) {
                // User is not a registered traveler
                const registerNow = window.confirm("You are not a registered traveler. Register now?");
                if (registerNow) {
                    navigate("/addtraveler");
                }
                return;
            }
    
            // Fetch schedules that match the criteria
            const schedulesResponse = await fetch(`/api/schedules?journeyDate=${journeyDate}&status=NotCompleted`);
            if (!schedulesResponse.ok) {
                // Handle errors or show a message
                console.error("Error fetching schedules. Status:", schedulesResponse.status);
                return;
            }
            const schedules = await schedulesResponse.json();
    
            // Create an array to store the selected train IDs
            const selectedTrainIds = [];
    
            // Iterate over schedules and add unique train IDs to the array
            schedules.forEach((schedule) => {
                if (!selectedTrainIds.includes(schedule.trainId)) {
                    selectedTrainIds.push(schedule.trainId);
                }
            });
    
            // Now you have the selected train IDs, and you can proceed with fetching other data
    
            // Fetch trains that match the schedules
            const trainIdsParam = selectedTrainIds.join(",");
            const trainsResponse = await fetch(`/api/trains?ids=${trainIdsParam}`);
            if (!trainsResponse.ok) {
                // Handle errors or show a message
                console.error("Error fetching trains. Status:", trainsResponse.status);
                return;
            }
            const trains = await trainsResponse.json();
    
            // Fetch train classes based on the selected train
            // For example, you can select the first train ID from the array
            const selectedTrainId = selectedTrainIds[0];
    
            const classesResponse = await fetch(`/api/trainclasses?trainId=${selectedTrainId}`);
            if (!classesResponse.ok) {
                // Handle errors or show a message
                console.error("Error fetching classes. Status:", classesResponse.status);
                return;
            }
            const classes = await classesResponse.json();
    
            // Combine and format data for display
            const formattedData = schedules.map((schedule) => {
                const train = trains.find((train) => train.id === schedule.trainId);
                const classDetails = classes.find((classDetail) => classDetail.trainId === schedule.trainId);
                return {
                    trainId: train.id,
                    trainName: train.name,
                    arrivalTime: schedule.arrivalTime,
                    departureTime: schedule.departureTime,
                    className: classDetails.className,
                    seats: classDetails.seats,
                    ticketPrice: classDetails.ticketPrice,
                };
            });
    
            setSearchResults(formattedData);
        } catch (error) {
            console.error("Error:", error);
        }
    };
    
      

    const handleProceed = (selectedBooking) => {
        navigate("/bookingSummary", { state: { booking: selectedBooking } });
    };

    return (
        <div>
            <h1>Add Booking</h1>
            <div>
                <label htmlFor="nic">NIC:</label>
                <input
                    type="text"
                    id="nic"
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="journeyDate">Journey Date:</label>
                <input
                    type="date"
                    id="journeyDate"
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="fromLocation">From Location:</label>
                <input
                    type="text"
                    id="fromLocation"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="toLocation">To Location:</label>
                <input
                    type="text"
                    id="toLocation"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="noOfPassengers">No of Passengers:</label>
                <input
                    type="number"
                    id="noOfPassengers"
                    value={noOfPassengers}
                    onChange={(e) => setNoOfPassengers(e.target.value)}
                />
            </div>
            <button onClick={handleSearch}>Search</button>
            <table>
                <thead>
                    <tr>
                        <th>Train ID</th>
                        <th>Train Name</th>
                        <th>Departure Time</th>
                        <th>Arrival Time</th>
                        <th>Class Name</th>
                        <th>Seats</th>
                        <th>Ticket Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResults.map((booking) => (
                        <tr key={booking.id}>
                            <td>{booking.trainId}</td>
                            <td>{booking.trainName}</td>
                            <td>{booking.departureTime}</td>
                            <td>{booking.arrivalTime}</td>
                            <td>{booking.className}</td>
                            <td>{booking.seats}</td>
                            <td>{booking.ticketPrice}</td>
                            <td>
                                <button onClick={() => handleProceed(booking)}>Proceed</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AddBooking;
