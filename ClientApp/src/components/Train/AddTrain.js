import React, { useState } from 'react';
import "../../styles/Train/AddTrain.css";

function AddTrain() {
  const [trainData, setTrainData] = useState({
    id: '',
    trainName: '',
    classes: [
      { className: '', seats: 0, ticketPrice: 0 },
    ],
    assignStatus: "Not assigned", // Set assignStatus as the default value here
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedClasses = [...trainData.classes];
    updatedClasses[index][name] = value;

    // Calculate and update available seats
    updatedClasses[index].availableSeats = parseInt(value);

    setTrainData({
      ...trainData,
      classes: updatedClasses,
    });
  };

  const handleAddClass = () => {
    setTrainData({
      ...trainData,
      classes: [
        ...trainData.classes,
        { className: '', seats: 0, ticketPrice: 0, availableSeats: 0 },
      ],
    });
  };

  const handleRemoveClass = (index) => {
    const updatedClasses = [...trainData.classes];
    updatedClasses.splice(index, 1);

    setTrainData({
      ...trainData,
      classes: updatedClasses,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // Calculate available seats for each class
      const updatedClasses = trainData.classes.map(cls => {
        cls.availableSeats = cls.seats;
        return cls;
      });

      // Update the trainData with the calculated available seats
      setTrainData({
        ...trainData,
        classes: updatedClasses,
      });
      // Serialize the trainData object to JSON
      const requestBody = JSON.stringify(trainData);

      // Send POST request to your API endpoint with the "Content-Type" header
      const response = await fetch('/api/trains', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: requestBody, // Send the serialized JSON data
      });

      if (response.ok) {
        // Train created successfully
        console.log('Train created successfully');
        window.location = "/trainList";
      } else if (response.status === 400) {
        // Handle validation errors or other client-side errors
        const errorData = await response.json();
        console.error('Failed to create train:', errorData);

        // Display validation error messages to the user
        if (errorData.errors) {
          // Loop through the validation errors and display them
          for (const errorKey in errorData.errors) {
            console.error(`Validation error for ${errorKey}: ${errorData.errors[errorKey]}`);
            // You can display these error messages in your UI to inform the user about specific issues.
          }
        }
      } else {
        // Handle other errors (e.g., server errors)
        console.error('Failed to create train');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className='add-background'>
      <div className="add-train-container">
        <h2>ADD NEW TRAIN</h2>
        <form className="add-train-form" onSubmit={handleSubmit} method='POST'>
          <div>
            <label>Train Name:</label>
            <input
              type="text"
              name="trainName"
              value={trainData.trainName}
              onChange={(e) => setTrainData({ ...trainData, trainName: e.target.value })}
            />
          </div>
          {trainData.classes.map((cls, index) => (
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
                <button className="remove-class-button" type="button" onClick={() => handleRemoveClass(index)}>
                  Remove Class
                </button>
              )}
            </div>
          ))}
          <button className="add-class-button" type="button" onClick={handleAddClass}>
            Add Class
          </button>
          <button className="train-submit-button" type="submit">SUBMIT</button>
        </form>
      </div>
    </div>
  );
}

export default AddTrain;
