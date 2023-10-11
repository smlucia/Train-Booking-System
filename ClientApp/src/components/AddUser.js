const entry = {
    id: "",
    name: "",
    email: "",
    password: "",
    role: "",
};

export default function AddUser(props) {

    const addNewUser = () =>
    {
        console.log( "The New User Is: ", entry );

        fetch( "api/user", {
            method: "POST",
            body: JSON.stringify( entry ),
            headers: {
                "content-type": "application/json"
            }

        } ).then( r =>
        {
            console.log( "Response from Backend for adding new user: ", r );
            window.location = "/userList";
        } ).catch( e => console.log( "Error adding new user: ", e ) );
    };

    const newData = ( e ) =>
    {
        const name_ = e.target.name;
        let v_ = e.target.value;

        entry[name_] = v_;

        console.log( "The New User Is: ", entry );
    };

    return (
        <main>
            <h1>Add New User</h1>

            <section>
                <div className="mt-10">
                    <label htmlFor="tn">Name</label>
                    <input type="text" name="name" id="tn" onChange={newData} />
                </div>

                <div className="mt-10">
                    <label htmlFor="ta">Email</label>
                    <input type="email" name="email" id="ta" onChange={newData} />
                </div>

                <div className="mt-10">
                    <label htmlFor="cn">Password</label>
                    <input type="password" name="password" id="cn" onChange={newData} />
                </div>

                <div className="mt-10">
                    <label htmlFor="tnic">Role</label>
                    <input type="text" name="role" id="tnic" onChange={newData} />
                </div>

                <div className="mt-30 row p20 justify-btw">
                    <div className="btn cancel" onClick={() => window.location = "/userList"}>Cancel</div>
                    <div className="btn add" onClick={addNewUser}>Add</div>
                </div> 

            </section>
        </main>

    );


}