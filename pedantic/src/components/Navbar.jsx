import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import { useEffect, useState } from "react";

function Navbar() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);
        };

        getUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setCurrentUser(session?.user || null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <nav style={{
            padding: "15px 30px",
            backgroundColor: "#0077ff",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px"
        }}>

        <div>
            <Link to="/" style={{ marginRight: "20px", color: "white", fontSize: "18px" }}>
                Home
            </Link>
            <Link to="/create" style={{ marginRight: "20px", color: "white", fontSize: "18px" }}>
                Create Post
            </Link>
            </div>

            <div>
                {currentUser ? (
                    <button onClick={handleLogout} style={{ padding: "8px 16px" }}>
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to="/login" style={{ marginRight: "10px", textDecoration: "none", fontWeight: "bold" }}>
                            Login
                        </Link>
                        <Link to="/signup" style={{ textDecoration: "none", fontWeight: "bold" }}>
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
