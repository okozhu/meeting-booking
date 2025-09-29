import { useState } from "react";
import { auth, setToken } from "../api.js";

import {BUSINESS_ROLE, CLIENT_ROLE} from "../utils/constants.js";

export default function Login({ onLogin }) {
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(CLIENT_ROLE);
    const [name, setName] = useState("");
    const [err, setErr] = useState("");

    async function handleSubmit(e){
        e.preventDefault();
        setErr("");
        try{
            const res = mode==="register"
                ? await auth.register({ email, password, name, role })
                : await auth.login({ email, password });

            if (res.message) {
                setErr(res.message);
                return;
            }

            setToken(res.token);
            onLogin();
        } catch (e) {
            setErr(e.message || "Error");
        }
    }

    return (
        <div className="stack">
            <h2>{mode==="register" ? "Create account" : "Login"}</h2>
            <form className="stack" onSubmit={handleSubmit}>
                {mode==="register" && (
                    <>
                        <input className="input" placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} />
                        <select className="select" value={role} onChange={e=>setRole(e.target.value)}>
                            <option value={CLIENT_ROLE}>CLIENT</option>
                            <option value={BUSINESS_ROLE}>BUSINESS</option>
                        </select>
                    </>
                )}
                <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
                <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
                {err && <div className="badge warn">{err}</div>}
                <div className="row">
                    <button type="submit" className="btn btn-primary">
                        {mode==="register" ? "Create account" : "Login"}
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={()=>setMode(mode==="register"?"login":"register")}>
                        {mode==="register" ? "Have an account? Login" : "No account?"}
                    </button>
                </div>
            </form>
        </div>
    );
}
