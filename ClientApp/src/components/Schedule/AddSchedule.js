import React, { useState, useEffect } from "react";
import "../../styles/Schedule/AddSchedule.css";

function AddSchedule() {
    const [trainData, setTrainData] = useState([]);
    const [scheduleData, setScheduleData] = useState({
        id: "",
        trainId: "", // Store the selected train ID and name as a string
        fromLocation: "",
        toLocation: "",
        departureTime: "", // Keep it as a string initially
        arrivalTime: "",
        scheduleDate: "",
        scheduleStatus: "",
    });

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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "trainId") {
            // Update trainId directly
            setScheduleData({
                ...scheduleData,
                trainId: value,
            });
        } else {
            // Update other inputs as usual
            setScheduleData({
                ...scheduleData,
                [name]: value,
            });
        }
    };


    const isFutureDate = (dateString) => {
        const currentDate = new Date();
        const selectedDate = new Date(dateString);
        return selectedDate > currentDate;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if scheduleDate is a future date
        if (!isFutureDate(scheduleData.scheduleDate)) {
            alert("Schedule Date should be a future date.");
            return;
        }

        try {
            // Extract the time part from the departureTime input
            const departureTimePart = scheduleData.departureTime;
            // Extract the time part from the arrivalTime input
            const arrivalTimePart = scheduleData.arrivalTime;

            // Construct the full time strings with the scheduleDate
            const formattedDepartureTime = new Date(`${scheduleData.scheduleDate}T${departureTimePart}`);
            const formattedArrivalTime = new Date(`${scheduleData.scheduleDate}T${arrivalTimePart}`);

            // Prepare the scheduleData object with the correctly formatted time values
            const formattedScheduleData = {
                ...scheduleData,
                departureTime: formattedDepartureTime.toISOString(),
                arrivalTime: formattedArrivalTime.toISOString(),
                scheduleStatus: "Not completed", // Set the default scheduleStatus
            };

            // Serialize the scheduleData object to JSON
            const requestBody = JSON.stringify(formattedScheduleData);

            // Send POST request to your API endpoint with the "Content-Type" header
            const response = await fetch("/api/schedules", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: requestBody, // Send the serialized JSON data
            });

            if (response.ok) {
                // Schedule created successfully
                console.log("Schedule created successfully");

                // Extract the trainId
                const selectedTrainId = scheduleData.trainId.split(" - ")[0];
                console.log(selectedTrainId);
                // const changeTrainDataStatus = trainData.filter((train) => train.id.includes(selectedTrainId));
                // const changeTrainDataStatus = trainData.filter((train) => train.id.slice(-4) === selectedTrainId);
                const matchingTrain = trainData.find((train) => train.id.endsWith(selectedTrainId));
                console.log(matchingTrain);

                const assignStatus = "Assigned";
                // Send a request to update the assignStatus of the selected train to "Assigned"
                const updateTrainResponse = await fetch(`/api/trains/${encodeURIComponent(matchingTrain.id)}/${assignStatus}`, {
                    method: "PUT", // You might need to change this to the appropriate method (e.g., PATCH)
                    headers: {
                        "Content-Type": "application/json",
                    },

                });
                console.log("Status marked", updateTrainResponse);
                if (updateTrainResponse.ok) {
                    console.log("Train status updated to 'Assigned'");
                } else {
                    console.error("Failed to update train status:", updateTrainResponse);
                }
                window.location = "/scheduleList";
            } else if (response.status === 400) {
                // Handle validation errors or other client-side errors
                const errorData = await response.json();
                console.error("Failed to create schedule:", errorData);

                // Display validation error messages to the user
                if (errorData.errors) {
                    for (const errorKey in errorData.errors) {
                        console.error(`Validation error for ${errorKey}: ${errorData.errors[errorKey]}`);
                    }
                }
            } else {
                // Handle other errors (e.g., server errors)
                console.error("Failed to create schedule");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    // Filter the trainData to display only the trains with assignStatus = "Not assigned"
    const filteredTrainData = trainData.filter((train) => train.assignStatus === "Not assigned");

    return (
        <div className='add-background'>
            <h2>ADD SCHEDULE</h2>
            <div className="add-schedule-container">
                <form className="add-schedule-form" onSubmit={handleSubmit} method="POST">
                    <label htmlFor="trainId">Train:</label>
                    <select
                        id="trainId"
                        name="trainId"
                        value={scheduleData.trainId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select a Train</option>
                        {filteredTrainData && filteredTrainData.length > 0 ? (
                            filteredTrainData.map((train) => (
                                <option
                                    key={train.trainId}
                                    value={`${train.id.slice(-4)} - ${train.trainName}`}
                                >
                                    {train.id.slice(-4)} - {train.trainName}
                                </option>
                            ))
                        ) : (
                            <option value="">No trains available</option>
                        )}

                    </select>
                    <br /><br />

                    <label htmlFor="fromLocation">From Location:</label>
                    <input
                        type="text"
                        id="fromLocation"
                        name="fromLocation"
                        value={scheduleData.fromLocation}
                        onChange={handleInputChange}
                        required
                    />
                    <br /><br />

                    <label htmlFor="toLocation">To Location:</label>
                    <input
                        type="text"
                        id="toLocation"
                        name="toLocation"
                        value={scheduleData.toLocation}
                        onChange={handleInputChange}
                        required
                    />
                    <br /><br />

                    <label htmlFor="departureTime">Departure Time:</label>
                    <input
                        type="time"
                        id="departureTime"
                        name="departureTime"
                        value={scheduleData.departureTime}
                        onChange={handleInputChange}
                        required
                    />
                    <br /><br />

                    <label htmlFor="arrivalTime">Arrival Time:</label>
                    <input
                        type="time"
                        id="arrivalTime"
                        name="arrivalTime"
                        value={scheduleData.arrivalTime}
                        onChange={handleInputChange}
                        required
                    />
                    <br /><br />

                    <label htmlFor="scheduleDate">Schedule Date:</label>
                    <input
                        type="date"
                        id="scheduleDate"
                        name="scheduleDate"
                        value={scheduleData.scheduleDate}
                        onChange={handleInputChange}
                        required
                    />
                    <br /><br />

                    <input type="submit" value="ADD SCHEDULE" />
                </form>
            </div>
        </div>
    );
}

export default AddSchedule;
