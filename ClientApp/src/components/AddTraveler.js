const entry = {
    id: "",
    name: "",
    address: "",
    contactNo: "",
    nic: "",
    activeStatus: "",
};

export default function AddTraveler(props) {

    const addNewTraveler = () =>
    {
        console.log( "The New Traveler Is: ", entry );

        fetch( "api/traveler", {
            method: "POST",
            body: JSON.stringify( entry ),
            headers: {
                "content-type": "application/json"
            }

        } ).then( r =>
        {
            console.log( "Response from Backend for adding new traveler: ", r );
            window.location = "/travelerList";
        } ).catch( e => console.log( "Error adding new traveler: ", e ) );
    };

    const newData = ( e ) =>
    {
        const name_ = e.target.name;
        let v_ = e.target.value;

        entry[name_] = v_;

        console.log( "The New Traveler Is: ", entry );
    };

    return (
        <main>
            <h1>Add New Traveler</h1>

            <section>
                <div className="mt-10">
                    <label htmlFor="tn">Name</label>
                    <input type="text" name="name" id="tn" onChange={newData} />
                </div>

                <div className="mt-10">
                    <label htmlFor="ta">Address</label>
                    <input type="text" name="address" id="ta" onChange={newData} />
                </div>

                <div className="mt-10">
                    <label htmlFor="cn">Contact Number</label>
                    <input type="text" name="contactNo" id="cn" onChange={newData} />
                </div>

                <div className="mt-10">
                    <label htmlFor="tnic">NIC</label>
                    <input type="text" name="nic" id="tnic" onChange={newData} />
                </div>

                <div className="mt-10">
                    <label htmlFor="tas">Active Status</label>
                    <input type="text" name="activeStatus" id="tas" onChange={newData} />
                </div>

                <div className="mt-30 row p20 justify-btw">
                    <div className="btn cancel" onClick={() => window.location = "/travelerList"}>Cancel</div>
                    <div className="btn add" onClick={addNewTraveler}>Add</div>
                </div> 

            </section>
        </main>

    );


}