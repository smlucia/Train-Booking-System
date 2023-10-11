import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditSchedule() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        trainId: "",
        fromLocation: "",
        toLocation: "",
        departureTime: "",
        arrivalTime: "",
        scheduleDate: "",
        scheduleStatus: "Not completed", // Set an initial value
    });
    const [trainData, setTrainData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [trainResponse, scheduleResponse] = await Promise.all([
                    fetch("/api/trains"),
                    fetch(`/api/schedules/${id}`),
                ]);

                if (!trainResponse.ok || !scheduleResponse.ok) {
                    throw new Error("Failed to fetch data");
                }

                const [trainData, scheduleData] = await Promise.all([
                    trainResponse.json(),
                    scheduleResponse.json(),
                ]);

                setTrainData(trainData);

                // Destructure and format the time and date fields
                const { departureTime, arrivalTime, scheduleDate, ...rest } = scheduleData;
                const formattedData = {
                    ...rest,
                    departureTime: departureTime.split("T")[1].slice(0, 5),
                    arrivalTime: arrivalTime.split("T")[1].slice(0, 5),
                    scheduleDate: scheduleDate.split("T")[0],
                };

                setFormData(formattedData);
            } catch (error) {
                console.error("Error:", error);
                setError("Failed to fetch data");
            }
        }

        fetchData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "scheduleDate" ? value : value.trim(),
        });
    };

    // Function to show confirmation dialog
    const showConfirmDialog = () => {
        return window.confirm('Are you sure you want to save changes?');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFutureDate(formData.scheduleDate)) {
            alert("Schedule Date should be a future date.");
            return;
        }

        if (!showConfirmDialog()) {
            // If the user cancels the confirmation, do not proceed with the submission
            return;
        }

        try {
            // Get date and time values from form data
            const { departureTime, arrivalTime, scheduleDate, ...restFormData } = formData;

            // Combine date and time values and format them properly
            const formattedDepartureTime = new Date(`${scheduleDate}T${departureTime}`);
            const formattedArrivalTime = new Date(`${scheduleDate}T${arrivalTime}`);

            // Create a new formData object with formatted date and time
            const formattedFormData = {
                ...restFormData,
                departureTime: formattedDepartureTime.toISOString(),
                arrivalTime: formattedArrivalTime.toISOString(),
                scheduleDate: scheduleDate, // Set the correctly formatted date
            };

            const response = await fetch(`/api/schedules/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedFormData),
            });

            if (response.ok) {
                console.log("Schedule data updated successfully");
                navigate('/scheduleList');
            } else {
                console.error("Failed to update schedule data");
                const errorResponse = await response.json();
                console.error("Error Response:", errorResponse);
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Failed to update schedule data");
        }
    };

    const isFutureDate = (dateString) => {
        const currentDate = new Date();
        const selectedDate = new Date(dateString);
        return selectedDate > currentDate;
    };

    return (
        <div>
            <h1>Edit Schedule</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="trainId">Train ID:</label>
                    <select
                        id="trainId"
                        name="trainId"
                        value={formData.trainId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select a Train</option>
                        {trainData && trainData.length > 0 ? (
                            trainData.map((train) => (
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
                </div>
                <div>
                    <label htmlFor="fromLocation">From Location:</label>
                    <input
                        type="text"
                        id="fromLocation"
                        name="fromLocation"
                        value={formData.fromLocation}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="toLocation">To Location:</label>
                    <input
                        type="text"
                        id="toLocation"
                        name="toLocation"
                        value={formData.toLocation}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="departureTime">Departure Time:</label>
                    <input
                        type="time"
                        id="departureTime"
                        name="departureTime"
                        value={formData.departureTime}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="arrivalTime">Arrival Time:</label>
                    <input
                        type="time"
                        id="arrivalTime"
                        name="arrivalTime"
                        value={formData.arrivalTime}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="scheduleDate">Schedule Date:</label>
                    <input
                        type="date"
                        id="scheduleDate"
                        name="scheduleDate"
                        value={formData.scheduleDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="scheduleStatus">Schedule Status:</label>
                    <select
                        id="scheduleStatus"
                        name="scheduleStatus"
                        value={formData.scheduleStatus}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="Not completed">Not completed</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <button type="submit">Update Schedule</button>
            </form>
        </div>
    );
}

export default EditSchedule;
