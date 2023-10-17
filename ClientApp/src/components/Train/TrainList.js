import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Train/TrainList.css";

function TrainList() {
    const [trains, setTrains] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const fetchTrains = async () => {
        try {
            const response = await fetch("/api/trains");
            if (response.ok) {
                const data = await response.json();
                setTrains(data);
                setIsLoading(false);
            } else {
                console.error("Failed to fetch trains");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleEditTrain = (id) => {
        navigate(`/editTrain/${id}`);
    };

    const handleAddNewTrain = () => {
        navigate("/addTrain");
    };

    useEffect(() => {
        fetchTrains();
    }, []);

    const handleDeleteTrain = async (id) => {
    const trainToDelete = trains.find((train) => train.id === id);

    if (trainToDelete) {
        const assignStatus = trainToDelete.assignStatus;

        const confirmDelete = window.confirm(
            `Are you sure you want to delete this train record with Train ID: ${id.slice(-8)}?`
        );

        if (confirmDelete && assignStatus !== "Assigned") {
            try {
                const response = await fetch(`/api/trains/${id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    setTrains((prevTrains) => prevTrains.filter((train) => train.id !== id));
                } else {
                    console.error(`Failed to delete train with ID ${id}`);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        } else if (assignStatus === "Assigned") {
            alert("You cannot delete this train's details, Since it has been assigned for a schedule");
        }
    }
};

    

    const filteredTrains = trains.filter((train) =>
        train.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='add-background'>
            <h2>TRAIN LIST</h2>
            <div className="train-list-container">
                <div className="train-list-search">
                    <label htmlFor="search">Search Train ID:</label>
                    <input type="text" placeholder="Enter the Train ID" id="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div>
                    <button
                        className="add-new-train-btn"
                        onClick={() => handleAddNewTrain()}>
                        Add New Train
                    </button>
                </div>
                <table className="train-list-table">
                    <thead>
                        <tr>
                            <th>Train ID</th>
                            <th>Train Name</th>
                            <th>Class Details</th>
                            <th>Assign Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTrains.map((train) => (
                            <tr key={train.id}>
                                <td>{train.id.slice(-8)}</td>
                                <td>{train.trainName}</td>
                                <td>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Class</th>
                                                <th>No of Seats</th>
                                                <th>Available Seats</th>
                                                <th>Ticket Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {train.classes.map((classData) => (
                                                <tr key={classData.className}>
                                                    <td>{classData.className}</td>
                                                    <td>{classData.seats}</td>
                                                    <td>{classData.availableSeats}</td>
                                                    <td>{classData.ticketPrice}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </td>
                                <td>{train.assignStatus}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEditTrain(train.id)}>EDIT</button>
                                    <button className="delete-btn" onClick={() => handleDeleteTrain(train.id)}>DELETE</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TrainList;
