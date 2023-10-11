import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

    useEffect(() => {
        fetchTrains();
    }, []);

    const handleDeleteTrain = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this train record"
        );

        if (confirmDelete) {
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
        }
    };

    const filteredTrains = trains.filter((train) =>
        train.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Train List</h2>
            <div>
                <label htmlFor="search">Search Train ID:</label>
                <input type="text" id="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <table>
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
                                            <th>Ticket Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {train.classes.map((classData) => (
                                            <tr key={classData.className}>
                                                <td>{classData.className}</td>
                                                <td>{classData.seats}</td>
                                                <td>{classData.ticketPrice}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </td>
                            <td>{train.assignStatus}</td>
                            <td>
                                <button onClick={() => handleEditTrain(train.id)}>Edit</button>
                                <button onClick={() => handleDeleteTrain(train.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TrainList;
