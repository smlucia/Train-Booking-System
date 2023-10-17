import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import "../../styles/Booking/AddBooking.css";

function AddBooking() {
    const navigate = useNavigate();
    const { id } = useParams();

    // State for form fields
    const [bookingData, setBookingData] = useState({
        bookingId: '',
        travelerNIC: '',
        travelerName: '',
        trainName: '',
        fromLocation: '',
        toLocation: '',
        departureTime: '',
        arrivalTime: '',
        journeyDate: '',
        trainClass: '',
        numberOfPassengers: 1,
        ticketPrice: 0,
        totalAmount: 0,
        reservationStatus: 'Not completed',
    });

    // State for the list of available traveler NICs
    const [travelers, setTravelers] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [trains, setTrains] = useState([]);
    const [bookingTrainClasses, setBookingTrainClasses] = useState([]);
    const [selectedTraveler, setSelectedTraveler] = useState(null);  // New state for filtered NICs

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch traveler data
                const travelerResponse = await fetch('/api/traveler');
                if (travelerResponse.ok) {
                    const travelers = await travelerResponse.json();
                    setTravelers(travelers);
                } else {
                    console.error('Failed to fetch traveler data.');
                }

                // Fetch schedule data
                const scheduleResponse = await fetch(`/api/schedules/${id}`);
                if (scheduleResponse.ok) {
                    const schedules = await scheduleResponse.json();
                    const { departureTime, arrivalTime, scheduleDate, ...rest } = schedules;
                    const formattedData = {
                        ...rest,
                        departureTime: departureTime.split("T")[1].slice(0, 5),
                        arrivalTime: arrivalTime.split("T")[1].slice(0, 5),
                        scheduleDate: scheduleDate.split("T")[0],
                    };

                    setSchedules(formattedData);

                    // Extract the train ID from schedules.trainId
                    const trainIdFromSchedule = schedules.trainId.split(' - ')[0];
                    // Extract the last four digits from the train ID
                    const selectedTrainId = trainIdFromSchedule.slice(-4);

                    // Fetch train data based on the extracted train ID
                    const trainResponse = await fetch('/api/trains');
                    if (trainResponse.ok) {
                        const trains = await trainResponse.json();
                        setTrains(trains);

                        // Find the train based on the extracted train ID
                        const matchingTrain = trains.find((train) => train.id.endsWith(selectedTrainId));

                        if (matchingTrain) {
                            // Set the bookingTrainClasses based on the train's classes
                            setBookingTrainClasses(matchingTrain.classes);

                            // Set fromLocation, toLocation, departureTime, and arrivalTime fields
                            setBookingData({
                                ...bookingData,
                                fromLocation: schedules.fromLocation,
                                toLocation: schedules.toLocation,
                                departureTime: formattedData.departureTime,
                                arrivalTime: formattedData.arrivalTime,
                                trainName: schedules.trainId,
                            });

                        }
                    } else {
                        console.error('Failed to fetch train data.');
                    }
                } else {
                    console.error('Failed to fetch schedule data.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        fetchData();
    }, [id]);

    //Calculating the Total Amount based on the passenger count and ticket price per person
    useEffect(() => {
        const calculateTotalAmount = () => {
            const { ticketPrice, numberOfPassengers } = bookingData;
            const totalAmount = ticketPrice * numberOfPassengers;
            setBookingData({ ...bookingData, totalAmount });
        };

        calculateTotalAmount();
    }, [bookingData.ticketPrice, bookingData.numberOfPassengers]);

    // Handle NIC selection
    const handleNICSelect = (selectedOption) => {
        const selectedNIC = selectedOption.value; // Selected value from the dropdown
        const selectedTraveler = travelers.find((traveler) => traveler.nic === selectedNIC);

        if (selectedTraveler) {
            // Set the selected NIC and the corresponding traveler name
            setBookingData({
                ...bookingData,
                travelerNIC: selectedNIC,
                travelerName: selectedTraveler.name,
            });
        }
    };

    // Create options for the Select component
    const options = travelers.map((traveler) => ({
        value: traveler.nic,
        label: traveler.nic,
    }));

    // Handle Train Class selection
    // Handle Train Class selection
    const handleTrainClassSelect = (e) => {
        const selectedClass = e.target.value;

        // Split the schedules.trainId to get the train ID
        const trainIdFromSchedule = schedules.trainId.split(' - ')[0];
        // Extract the last four digits from the train ID
        const selectedTrainId = trainIdFromSchedule.slice(-4);

        // Find the train based on the extracted train ID
        const matchingTrain = trains.find((train) => train.id.endsWith(selectedTrainId));

        if (matchingTrain) {
            // Filter bookingTrainClasses to include only classes with availableSeats > 1
            const filteredClasses = matchingTrain.classes.filter((classData) => classData.availableSeats > 0);

            // Set the bookingTrainClasses based on the filtered classes
            setBookingTrainClasses(filteredClasses);

            // Find the selected class data within the updated bookingTrainClasses
            const selectedClassData = filteredClasses.find((classData) => classData.className === selectedClass);

            if (selectedClassData) {
                const ticketPrice = selectedClassData.ticketPrice;

                setBookingData({
                    ...bookingData,
                    trainClass: selectedClass,
                    ticketPrice: ticketPrice,
                });
            }
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setBookingData({
            ...bookingData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if scheduleDate is a future date
        if (!isFutureDate(bookingData.journeyDate)) {
            alert("Journey Date should be a future date.");
            return;
        }

        const existingBooking = await checkExistingBooking(bookingData.travelerNIC);

        if (!existingBooking) {
            // Create the booking
            const departureTimePart = bookingData.departureTime;
            const arrivalTimePart = bookingData.arrivalTime;
            const formattedDepartureTime = new Date(`${bookingData.journeyDate}T${departureTimePart}`);
            const formattedArrivalTime = new Date(`${bookingData.journeyDate}T${arrivalTimePart}`);

            const formattedBookingData = {
                ...bookingData,
                departureTime: formattedDepartureTime.toISOString(),
                arrivalTime: formattedArrivalTime.toISOString(),
                scheduleStatus: "Not completed",
            };

            // Serialize the bookingData object to JSON
            const requestBody = JSON.stringify(formattedBookingData);

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: requestBody,
            });

            if (response.ok) {
                // Booking created successfully
                console.log('Booking created successfully');
                window.location = "/bookingList";
                // Extract the train ID from schedules.trainId
                const trainIdFromSchedule = schedules.trainId.split(' - ')[0];
                // Extract the last four digits from the train ID
                const selectedTrainId = trainIdFromSchedule.slice(-4);
                // Find the train based on the extracted train ID
                const matchingTrain = trains.find((train) => train.id.endsWith(selectedTrainId));
                const selectedClass = bookingData.trainClass;
                // Find the selected class data within the updated bookingTrainClasses
                const selectedClassData = matchingTrain.classes.find((classData) => classData.className === selectedClass);
                // Now, update the train's availableSeats
                const updatedAvailableSeats = selectedClassData.availableSeats - bookingData.numberOfPassengers;
                console.log(updatedAvailableSeats);
                await updateTrainAvailableSeats(matchingTrain.id, updatedAvailableSeats);

                // Redirect or show a success message
            } else {
                // Handle validation errors or other client-side errors
                const errorData = await response.json();
                console.error('Failed to create booking:', errorData);
                // Display validation error messages to the user
            }
        } else {
            alert('The selected traveler already has a reservation.');
        }
    };

    const updateTrainAvailableSeats = async (trainId, updatedAvailableSeats) => {
        console.log("Train ID : ", trainId);
        console.log("Updated seats : ", updatedAvailableSeats);
        // Send a PUT request to update the schedule status in the API
        const updatedNewAvailableSeats = {
            ...trains.find((train) => train.id === trainId),
            availableSeats: updatedAvailableSeats,
        };
        // Serialize the bookingData object to JSON
        const requestBodyUpdate = JSON.stringify(updatedNewAvailableSeats);
        try {
            const response = await fetch(`/api/trains/${trainId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBodyUpdate,
            });

            if (response.ok) {
                console.log('Train availableSeats updated successfully');
            } else {
                const errorData = await response.json();
                console.error('Failed to update train availableSeats:', errorData);
            }
        } catch (error) {
            console.error('Error updating train availableSeats:', error);
        }
    };

    const checkExistingBooking = async (travelerNIC) => {
        const reservationStatus = "Not completed";
        // Send a request to check if an existing booking with the same traveler NIC and "Not completed" status exists
        const response = await fetch(`/api/bookings/${travelerNIC}/${reservationStatus}`);
        if (response.ok) {
            const existingBookings = await response.json();
            return existingBookings.length > 0;
        } else {
            console.error('Failed to check existing bookings:', response);
            return false; // If there's an error, consider allowing the booking to proceed
        }
    };

    const isFutureDate = (dateString) => {
        const currentDate = new Date();
        const selectedDate = new Date(dateString);
        return selectedDate > currentDate;
    };


    return (
        <div className='add-background'>
            <h2>ADD NEW BOOKING</h2>
            <div className='add-booking-container'>
                <form className="add-booking-form" onSubmit={handleSubmit}>
                    <div>
                        <label>Traveler NIC:</label>
                        <Select
                            options={options}
                            // value={selectedTraveler}
                            onChange={handleNICSelect}
                            isSearchable={true}
                            placeholder="Select or type the Traveler's NIC"
                        />
                    </div>
                    <div>
                        <label>Traveler Name:</label>
                        <input
                            id="travelerName"
                            type="text"
                            name="travelerName"
                            value={bookingData.travelerName}
                            onChange={handleInputChange}
                            readOnly
                            required
                        />
                    </div>
                    <div>
                        <label>Train Name:</label>
                        <input
                            id="trainName"
                            type="text"
                            name="trainName"
                            value={bookingData.trainName}
                            onChange={handleInputChange}
                            readOnly
                        />
                    </div>
                    <div>
                        <label>From Location:</label>
                        <input
                            id="fromLocation"
                            type="text"
                            name="fromLocation"
                            value={bookingData.fromLocation}
                            onChange={handleInputChange}
                            readOnly
                        />
                    </div>
                    <div>
                        <label>To Location:</label>
                        <input
                            id="toLocation"
                            type="text"
                            name="toLocation"
                            value={bookingData.toLocation}
                            onChange={handleInputChange}
                            readOnly
                        />
                    </div>
                    <div>
                        <label>Departure Time:</label>
                        <input
                            id="departureTime"
                            type="text"
                            name="departureTime"
                            value={bookingData.departureTime}
                            onChange={handleInputChange}
                            readOnly
                        />
                    </div>
                    <div>
                        <label>Arrival Time:</label>
                        <input
                            id="arrivalTime"
                            type="text"
                            name="arrivalTime"
                            value={bookingData.arrivalTime}
                            onChange={handleInputChange}
                            readOnly
                        />
                    </div>
                    <div>
                        <label htmlFor="journeyDate">Journey Date:</label>
                        <input
                            type="date"
                            id="journeyDate"
                            name="journeyDate"
                            value={bookingData.journeyDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {/* Handle train class dropdown */}
                    <div>
                        <label>Train Class:</label>
                        <select
                            id="trainClass"
                            name="trainClass"
                            value={bookingData.trainClass}
                            onChange={handleTrainClassSelect}
                        >
                            <option value="">Select Class</option>
                            {bookingTrainClasses.map((classData) => (
                                <option key={classData.className} value={classData.className}>
                                    {classData.className}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Number of Passengers:</label>
                        <input
                            id="numberOfPassengers"
                            type="number"
                            name="numberOfPassengers"
                            value={bookingData.numberOfPassengers}
                            onChange={(e) => setBookingData({ ...bookingData, numberOfPassengers: e.target.value })}
                            max={4}
                            min={1}
                        />
                    </div>
                    <div>
                        <label>Ticket Price (Per Person - Rs.):</label>
                        <input
                            id="ticketPrice"
                            type="number"
                            name="ticketPrice"
                            value={bookingData.ticketPrice}
                            onChange={handleInputChange}
                            readOnly
                        />
                    </div>
                    <div>
                        <label>Total Amount (Rs.):</label>
                        <input
                            id="totalAmount"
                            type="number"
                            name="totalAmount"
                            value={bookingData.totalAmount}
                            onChange={handleInputChange}
                            readOnly
                        />
                    </div>
                    <button className="booking-submit-button" type="submit">RESERVE NOW</button>
                </form>
            </div>
        </div>
    );
}

export default AddBooking;
