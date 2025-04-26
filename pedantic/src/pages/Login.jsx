import { useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error(error);
            alert(error.message);
        } else {
            navigate("/");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                <img src={logo} alt="Pedantic Logo" style={{ width: "50px", marginRight: "10px" }} />
                <h1 style={{ fontSize: "32px", color: "#0077ff" }}>Pedantic</h1>
            </div>
            <p style={{ marginBottom: "20px", fontSize: "16px", color: "#555" }}>Log in to access your academic community!</p>

            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                />
                <button type="submit" style={{ padding: "10px 20px" }}>
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
