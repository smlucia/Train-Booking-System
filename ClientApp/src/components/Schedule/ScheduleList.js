import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../../styles/Schedule/ScheduleList.css";

function ScheduleList() {
    const [schedules, setSchedules] = useState([]);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [statusDropdowns, setStatusDropdowns] = useState({});
    const [statusUpdates, setStatusUpdates] = useState({});
    const [showStatusDropdowns, setShowStatusDropdowns] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSchedules() {
            try {
                const response = await fetch("/api/schedules");
                if (response.ok) {
                    const data = await response.json();
                    setSchedules(data);
                    setFilteredSchedules(data);
                } else {
                    console.error("Failed to fetch schedules.");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }

        fetchSchedules();
    }, []);

    const extractTrainId = (trainId) => {
        // Extract the train ID from the combined trainId
        const trainIdPart = trainId.split(" - ")[0];
        return trainIdPart;
    };

    const updateAssignStatus = async (scheduleId, newScheduleStatus) => {
        try {
            // Extract the train ID from the schedule's trainId
            const trainId = extractTrainId(schedules.find((schedule) => schedule.id === scheduleId).trainId);
            console.log(trainId);
            // Determine the new assignStatus
            const assignStatus = newScheduleStatus === "Completed" ? "Not assigned" : "Assigned";

            // Fetch the list of available trains (trainId) from the server
            const response = await fetch("/api/trains");
            if (response.ok) {
                const trainData = await response.json();

                // Find and update the train with matching trainId
                const matchingTrain = trainData.find((train) => train.id.endsWith(trainId));
                console.log(matchingTrain);
                if (matchingTrain) {
                    const trainResponse = await fetch(`/api/trains/${encodeURIComponent(matchingTrain.id)}/${assignStatus}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        // body: JSON.stringify({ assignStatus }),
                    });
                    console.log(trainResponse);
                    if (trainResponse.ok) {
                        // Assign status updated successfully
                        console.log("Assign status updated successfully");
                    } else {
                        console.error("Failed to update assign status");
                    }
                }
            } else {
                console.error("Failed to fetch train data.");
            }
        } catch (error) {
            console.error("Error updating assign status:", error);
        }
    };


    const handleStatusChange = async (scheduleId, newScheduleStatus) => {
        try {
            // Update the statusUpdates state with the new status
            setStatusUpdates({
                ...statusUpdates,
                [scheduleId]: newScheduleStatus,
            });

            // Hide the status dropdown after selecting a new status
            setShowStatusDropdowns({
                ...showStatusDropdowns,
                [scheduleId]: false,
            });

            // Send a PUT request to update the schedule status in the API
            const updatedSchedule = {
                ...schedules.find((schedule) => schedule.id === scheduleId),
                scheduleStatus: newScheduleStatus,
            };

            const response = await fetch(`/api/schedules/${scheduleId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedSchedule),
            });
            if (response.ok) {
                // Schedule status updated successfully
                console.log("Schedule status updated successfully");

                // Update the 'schedules' state with the updated status
                setSchedules((prevSchedules) =>
                    prevSchedules.map((schedule) =>
                        schedule.id === scheduleId ? updatedSchedule : schedule
                    )
                );

                // Update the assignStatus
                updateAssignStatus(scheduleId, newScheduleStatus);
            } else {
                // Handle the case where the update request failed
                console.error("Failed to update schedule status");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDeleteClick = async (id) => {
        // Display a window.confirm dialog for the delete confirmation
        const confirmed = window.confirm(`Are you sure you want to delete this schedule record with Schedule ID: ${id.slice(-8)}?`);

        if (confirmed) {
            // Send a DELETE request to remove the schedule from the API
            try {
                const response = await fetch(`/api/schedules/${id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    // Schedule deleted successfully
                    console.log("Schedule deleted successfully");

                    // Update the 'schedules' state by removing the deleted schedule
                    setSchedules((prevSchedules) =>
                        prevSchedules.filter((schedule) => schedule.id !== id)
                    );
                } else {
                    // Handle the case where the delete request failed
                    console.error("Failed to delete schedule");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };

    // Function to handle editing a schedule
    const handleEditClick = (id) => {
        // Navigate to the edit page with the schedule's ID as a URL parameter
        navigate(`/editSchedule/${id}`);
    };

    // Function to handle reserve a booking
    const handleReserveNow = (id) => {
        const schedule = schedules.find((schedule) => schedule.id === id);

        if (schedule && schedule.scheduleStatus === "Completed") {
            // Display an alert message if the schedule status is "Completed"
            alert("SORRY! This schedule has been completed, try another schedule to make your reservation");
        } else {
            // Navigate to the booking page if the schedule status is not "Completed"
            navigate(`/addBooking/${id}`);
        }
    };


    const handleAddNewSchedule = () => {
        navigate("/addSchedule");
    };

    const handleStatusClick = (id) => {
        // Show the status dropdown for the schedule with the given ID
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
        const filtered = schedules.filter((schedule) =>
            schedule.id.toLowerCase().includes(searchValue.toLowerCase())
        );

        setFilteredSchedules(filtered);
    };

    return (
        <div className='add-background'>
            <h2>SCHEDULE LIST</h2>
            <div className="schedule-list-container">
                <div className="schedule-search">
                    <label htmlFor="search">Search Schedule ID:</label>
                    <input
                        placeholder="Enter the Schedule ID"
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div>
                    <button
                        className="add-new-schedule-btn"
                        onClick={() => handleAddNewSchedule()}>
                        Add New Schedule
                    </button>
                </div>
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th>Schedule ID</th>
                            <th>Train ID</th>
                            <th>From Location</th>
                            <th>To Location</th>
                            <th>Departure Time</th>
                            <th>Arrival Time</th>
                            <th>Schedule Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSchedules.map((schedule) => (
                            <tr key={schedule.id}>
                                <td>{schedule.id.slice(-8)}</td>
                                <td>{schedule.trainId}</td>
                                <td>{schedule.fromLocation}</td>
                                <td>{schedule.toLocation}</td>
                                <td>{formatTime(schedule.departureTime)}</td>
                                <td>{formatTime(schedule.arrivalTime)}</td>
                                <td>{formatDate(schedule.scheduleDate)}</td>
                                <td>
                                    {showStatusDropdowns[schedule.id] ? (
                                        <div className="status-text">
                                            <select
                                                value={statusUpdates[schedule.id] || schedule.scheduleStatus}
                                                onChange={(e) => handleStatusChange(schedule.id, e.target.value)}
                                            >
                                                <option value="Not completed">Not completed</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                            <button
                                                onClick={() => handleStatusChange(schedule.id, statusUpdates[schedule.id])}
                                            >
                                                &#10003; {/* Checkmark symbol */}
                                            </button>
                                            <button onClick={() => setShowStatusDropdowns({})}>&#10005; {/* Cross symbol */}</button>
                                        </div>
                                    ) : (
                                        <div onClick={() => handleStatusClick(schedule.id)}>
                                            {schedule.scheduleStatus}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <button className="schedule-reserve-now-btn" onClick={() => handleReserveNow(schedule.id)}>RESERVE NOW</button><br />
                                    <button className="schedule-edit-btn" onClick={() => handleEditClick(schedule.id)}>EDIT</button>
                                    <button className="schedule-delete-btn" onClick={() => handleDeleteClick(schedule.id)}>DELETE</button>
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
