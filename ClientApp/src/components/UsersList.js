import { useEffect, useState } from "react";
import React, { Component } from "react";


export default function UsersList() {

    const [user, setUser] = useState([]);
    const [uid, setUid] = useState( "" );

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
        setUid(id);
        handleModal(false);
    };
    const deleteuser = () => {
        // console.log( "The Student ID: ", Uid );
        // return;
        fetch("api/user/" + uid, {
            method: "DELETE",
        }).then(r => {
            console.log("Response for deleting a user: ", r);
            handleModal(true);
            window.location.reload();

        }).catch(e => console.log("Error deleting a user: ", e));
    };

    useEffect(() => {
        fetch("api/user")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Request failed with status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("The users are: ", data);
                setUser(data);
            })
            .catch((error) => {
                console.error("Error fetching all users: ", error);
            });
    }, []);
    
    // useEffect(() => {
    //     fetch("api/user").then(r => r.json()).then(d => {
    //         console.log("The users are: ", d);
    //         setUser(d);
    //     }).catch(e => console.log("The error fetching all users: ", e));
    // }, []);

    return (
        <main>
            <h1>Ticket Reservation Application</h1>

            <div className="add-btn">
                <a href="/adduser">Add New user</a>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Role</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        user.length === 0 ? <tr className="row waiting"><td className="row">Loading<span className="loading">...</span></td></tr> :
                            user.map(user => <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <td>{user.role}</td>
                                <td><a href={"/edituser?id=" + user.id}>Edit</a></td>
                                <td onClick={() => { openDeleteModal( user.id ); }}>Delete</td>
                            </tr>)
                    }
                </tbody>
            </table>

            <section className="delete-modal hidden">
                <div className="modal-item">
                    <h3>Delete user</h3>
                    <p>Are you sure you want to delete this user?</p>
                    <div className="row mt-20 justify-btw">
                        <div className="btn cancel" onClick={() => { handleModal(true); }}>Cancel</div>
                        <div className="btn add" onClick={deleteuser}>Delete</div>
                    </div>
                </div>
            </section>
        </main>





    );


}