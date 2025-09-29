import React from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { getToken, clearToken } from "./api.js";

const App = () => {
    const [loggedIn, setLoggedIn] = React.useState(!!getToken());
    return (
        <div className="app">
            <header className="header">
                <div>
                    <h1 className="title">Meeting Booking</h1>
                </div>
                {loggedIn && (
                    <button className="btn btn-ghost" onClick={() => { clearToken(); setLoggedIn(false); }}>
                        Logout
                    </button>
                )}
            </header>

            <div className="stack">
                {loggedIn ? (
                    <div className="card"><Dashboard/></div>
                ) : (
                    <div className="card"><Login onLogin={()=>setLoggedIn(true)}/></div>
                )}
            </div>
        </div>
    );
}

export default App;
