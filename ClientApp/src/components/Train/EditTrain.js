import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditTrain() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [train, setTrain] = useState({
        trainName: '',
        classes: [
            { className: '', seats: 0, ticketPrice: 0 },
        ],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch the train details by ID when the component mounts
        const fetchTrainById = async () => {
            try {
                const response = await fetch(`/api/trains/${id}`); // Replace with your API endpoint
                if (response.ok) {
                    const data = await response.json();
                    setTrain(data);
                    setIsLoading(false);
                } else {
                    console.error(`Failed to fetch train with ID ${id}`);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchTrainById();
    }, [id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!train) {
        return <div>Train not found</div>;
    }

    // Function to show confirmation dialog
    const showConfirmDialog = () => {
        return window.confirm('Are you sure you want to save changes?');
    };


    // Handle form submission to update train details
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!showConfirmDialog()) {
            // If the user cancels the confirmation, do not proceed with the submission
            return;
        }

        try {
            const response = await fetch(`/api/trains/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(train), // Send the updated train data
            });

            if (response.ok) {
                console.log('Train updated successfully');
                // Redirect to the train list or perform other actions
                navigate('/trainList'); // Redirect to the train list page
            } else {
                console.error(`Failed to update train with ID ${id}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Handle input changes
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedClasses = [...train.classes];
        updatedClasses[index][name] = value;

        setTrain({
            ...train,
            classes: updatedClasses,
        });
    };

    // Handle adding a class
    const handleAddClass = () => {
        setTrain({
            ...train,
            classes: [
                ...train.classes,
                { className: '', seats: 0, ticketPrice: 0 },
            ],
        });
    };

    // Handle removing a class
    const handleRemoveClass = (index) => {
        const updatedClasses = [...train.classes];
        updatedClasses.splice(index, 1);

        setTrain({
            ...train,
            classes: updatedClasses,
        });
    };

    return (
        <div>
            <h2>Edit Train</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Train Name:</label>
                    <input
                        type="text"
                        name="trainName"
                        value={train.trainName}
                        onChange={(e) => setTrain({ ...train, trainName: e.target.value })}
                    />
                </div>
                {train.classes.map((cls, index) => (
                    <div key={index}>
                        <label>Class Name:</label>
                        <input
                            type="text"
                            name="className"
                            value={cls.className}
                            onChange={(e) => handleInputChange(e, index)}
                        />
                        <label>Seats:</label>
                        <input
                            type="number"
                            name="seats"
                            value={cls.seats}
                            onChange={(e) => handleInputChange(e, index)}
                        />
                        <label>Ticket Price:</label>
                        <input
                            type="number"
                            name="ticketPrice"
                            value={cls.ticketPrice}
                            onChange={(e) => handleInputChange(e, index)}
                        />
                        {index > 0 && (
                            <button type="button" onClick={() => handleRemoveClass(index)}>
                                Remove Class
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={handleAddClass}>
                    Add Class
                </button>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default EditTrain;
