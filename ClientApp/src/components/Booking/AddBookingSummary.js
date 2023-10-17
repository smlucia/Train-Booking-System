import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "../../styles/Booking/AddBookingSummary.css";

function AddBooking() {
    const [nic, setNic] = useState("");
    const [journeyDate, setJourneyDate] = useState("");
    const [fromLocation, setFromLocation] = useState("");
    const [toLocation, setToLocation] = useState("");
    const [noOfPassengers, setNoOfPassengers] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [trainData, setTrainData] = useState([]);
    const navigate = useNavigate();

    //Funtion to handle fetching train data
    useEffect(() => {
        // Fetch the list of available trains (trainId and trainName) from the server
        async function fetchTrainData() {
            try {
                const response = await fetch("/api/trains");
                if (response.ok) {
                    const trainData = await response.json();
                    setTrainData(trainData);
                } else {
                    console.error("Failed to fetch train data.");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }

        fetchTrainData();
    }, []);

    //Function to handle Search
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

            const formattedDate = new Date(journeyDate).toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'

            const schedulesResponse = await fetch(`/api/schedules/${formattedDate}/Not%20completed`);
            console.log(schedulesResponse);
            if (schedulesResponse.ok) {
                const schedules = await schedulesResponse.json();
                console.log("journeyDate:", journeyDate);
                console.log("Schedules:", schedules);

                // Filter schedules based on train availability
                const selectedSchedules = await Promise.all(schedules.map(async (schedule) => {
                    // Check if schedule.trainId exists before splitting
                    if (schedule.trainId) {
                        const scheduleTrainId = schedule.trainId.split("-")[0]; // Assuming format: "{TrainID}-TRAIN"
                        console.log(scheduleTrainId);
                        const matchingTrain = trainData.find((train) => train.id);
                        // const matchingTrain = trainData.find((train) => {
                        //     console.log("Comparing:", train.id, "to", scheduleTrainId);
                        //     return train.id === train.id.endsWith(scheduleTrainId);
                        // });
                        console.log(trainData);
                        console.log(matchingTrain);
                        // Fetch train details from the train database
                        const trainResponse = await fetch(`/api/trains/${matchingTrain.id}`);
                        console.log(trainResponse);
                        if (trainResponse.ok) {
                            const train = await trainResponse.json();
                            return train && train.id.endsWith(scheduleTrainId);
                        }
                        console.log(trainResponse);
                    }
                    return false;
                }));

                console.log("Selected Schedule: ", selectedSchedules);
                // Fetch class details for the selected schedules
                const classPromises = selectedSchedules.map((schedule) => {
                    // Encode the train name before using it in the API request URL
                    const encodedTrainName = encodeURIComponent(schedule.trainName);
                    return fetch(`/api/trainclasses?trainName=${encodedTrainName}`);
                });

                const classResponses = await Promise.all(classPromises);

                if (!classResponses.every((response) => response.ok)) {
                    // Handle errors or show a message
                    console.error("Error fetching class details.");
                    return;
                }

                const classData = await Promise.all(classResponses.map((response) => response.json()));

                // Combine and format data for display
                const formattedData = selectedSchedules.map((schedule, index) => {
                    const classDetails = classData[index][0]; // Assuming one class per schedule
                    return {
                        trainId: schedule.trainId,
                        trainName: schedule.trainName,
                        arrivalTime: schedule.arrivalTime,
                        departureTime: schedule.departureTime,
                        className: classDetails.className,
                        seats: classDetails.seats,
                        ticketPrice: classDetails.ticketPrice,
                    };
                });

                setSearchResults(formattedData);
            } else {
                console.error("Error fetching schedules. Status:", schedulesResponse.status);
            }
        } catch (error) {
            // console.error("Error:", error);
        }
    };


    const handleProceed = (selectedBooking) => {
        // You can navigate to the booking summary page here with the selected booking
        navigate("/bookingSummary", { state: { booking: selectedBooking } });
    };

    //Function to handle cancel
    const handleCancel = (id) => {
        navigate("/bookingSummary");
    };

    return (
        <div className='add-background'>
            <h2>MAKE RESERVATION</h2>
            <div className="add-booking-container">
                <form className="add-booking-form">                 
                    <div>
                        <label htmlFor="nic">Traveler NIC:</label>
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
                    <button className= "booking-submit-button" onClick={handleSearch}>CONFIRM RESERVATION</button>
                    <button className= "cancel-button" onClick={handleCancel}>CANCEL</button>
                </form>
            </div>
        </div>
    );
}

export default AddBooking;

