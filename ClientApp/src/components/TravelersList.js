import { useEffect, useState } from "react";
import React, { Component } from "react";


export default function TravelersList() {

    const [traveler, setTraveler] = useState([]);
    const [tid, setTid] = useState( "" );

    const handleModal = (hide) => {
        const deleteModal = document.querySelector(".delete-modal");
        if (deleteModal) {
            if (hide) {
                deleteModal.classList.add("hidden");
            } else {
                deleteModal.classList.remove("hidden");
            }

        }
    };

    const openDeleteModal = (id) => {
        setTid(id);
        handleModal(false);
    };
    const deleteTraveler = () => {
        // console.log( "The Student ID: ", sid );
        // return;
        fetch("api/traveler/" + tid, {
            method: "DELETE",
        }).then(r => {
            console.log("Response for deleting a traveler: ", r);
            handleModal(true);
            window.location.reload();

        }).catch(e => console.log("Error deleting a traveler: ", e));
    };

    useEffect(() => {
        fetch("api/traveler").then(r => r.json()).then(d => {
            console.log("The travelers are: ", d);
            setTraveler(d);
        }).catch(e => console.log("The error fetching all travelers: ", e));
    }, []);

    return (
        <main>
            <h1>Ticket Reservation Application</h1>

            <div className="add-btn">
                <a href="/addTraveler">Add New Traveler</a>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Contact Number</th>
                        <th>NIC</th>
                        <th>Active Status</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        traveler.length === 0 ? <tr className="row waiting"><td className="row">Loading<span className="loading">...</span></td></tr> :
                            traveler.map(traveler => <tr key={traveler.id}>
                                <td>{traveler.name}</td>
                                <td>{traveler.address}</td>
                                <td>{traveler.contactNo}</td>
                                <td>{traveler.nic}</td>
                                <td>{traveler.activeStatus}</td>
                                <td><a href={"/editTraveler?id=" + traveler.id}>Edit</a></td>
                                <td onClick={() => { openDeleteModal( traveler.id ); }}>Delete</td>
                            </tr>)
                    }
                </tbody>
            </table>

            <section className="delete-modal hidden">
                <div className="modal-item">
                    <h3>Delete Traveler</h3>
                    <p>Are you sure you want to delete this traveler?</p>
                    <div className="row mt-20 justify-btw">
                        <div className="btn cancel" onClick={() => { handleModal(true); }}>Cancel</div>
                        <div className="btn add" onClick={deleteTraveler}>Delete</div>
                    </div>
                </div>
            </section>
        </main>





    );


}