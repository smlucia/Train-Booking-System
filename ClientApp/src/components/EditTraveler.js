import { useEffect, useState } from "react";

const entry = {
    id: "",
    name: "",
    address: "",
    contactNo: "",
    nic: "",
    activeStatus: "",
};

export default function EditTraveler(props) {


    const [data, setData] = useState( {} );
    const [tid, setTid] = useState( "" );

    const updateTraveler = () =>
    {
        console.log( "The New Traveler Is: ", entry );

        fetch( "api/traveler/" + tid, {
            method: "PUT",
            body: JSON.stringify( entry ),
            headers: {
                "content-type": "application/json"
            }

        }).then( r =>
        {
            console.log( "Response from Backend for updating new traveler: ", r );
            window.location = "/travelerList";
        } ).catch( e => console.log( "Error updating new traveler: ", e ) );
    };

    const newData = ( e ) =>
    {
        const name_ = e.target.name;
        let v_ = e.target.value;

        entry[name_] = v_;

        console.log( "The New Traveler Is: ", entry );
    };

    useEffect( () =>
    {
        let id_ = window.location.search;
        if ( id_ )
        {
            id_ = id_.split( "=" )[1];
        }

        if ( id_ )
        {
            setTid( id_ );

            fetch( "api/traveler/" + id_ ).then( r => r.json() ).then( d =>
            {
                console.log( "Traveler for update: ", d );
                setData( d );
                Object.assign( entry, d );
            } ).catch( e => console.log( "Error getting traveler for update: ", e ) );
        }

    }, [] );
    
    return (
        <main>
            <h1>Update Traveler</h1>

            <section>
                <div className="mt-10">
                    <label htmlFor="tn">Name</label>
                    <input type="text" name="name" id="tn" defaultValue={data.name} onChange={newData} />
                </div>

                <div className="mt-10">
                    <label htmlFor="ta">Address</label>
                    <input type="text" name="address" id="ta" defaultValue={data.address} onChange={newData} />
                </div>

                <div className="mt-10">
                    <label htmlFor="cn">Contact Number</label>
                    <input type="text" name="contactNo" id="cn" defaultValue={data.contactNo} onChange={newData} />
                </div>

                <div className="mt-10">
                    <label htmlFor="tnic">NIC</label>
                    <input type="text" name="nic" id="tnic" defaultValue={data.nic} onChange={newData} />
                </div>

                <div className="mt-10">
                    <label htmlFor="tas">Active Status</label>
                    <input type="text" name="activeStatus" id="tas" defaultValue={data.activeStatus} onChange={newData} />
                </div>

                <div className="mt-30 row p20 justify-btw">
                    <div className="btn cancel" onClick={() => window.location = "/travelerList"}>Cancel</div>
                    <div className="btn add" onClick={updateTraveler}>Update</div>
                </div> 

            </section>
        </main>
        
    );
        
    
}