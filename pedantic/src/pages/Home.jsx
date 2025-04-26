import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("created_at");

    const fetchPosts = async () => {
        let query = supabase.from("posts").select("*");

        if (sortBy === "created_at") {
            query = query.order("created_at", { ascending: false });
        } else if (sortBy === "upvotes") {
            query = query.order("upvotes", { ascending: false });
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching posts:", error);
        } else {
            setPosts(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, [sortBy]);

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                <img src={logo} alt="Pedantic Logo" style={{ width: "50px", marginRight: "10px" }} />
                <h1 style={{ fontSize: "32px", color: "#0077ff" }}>Pedantic</h1>
            </div>



            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "60%", padding: "10px", marginRight: "10px", borderRadius: "8px" }}
                />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: "10px", borderRadius: "8px" }}>
                    <option value="created_at">Newest</option>
                    <option value="upvotes">Most Upvotes</option>
                </select>
            </div>

            {loading ? (
                <p>Loading posts...</p>
            ) : filteredPosts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                filteredPosts.map((post) => (
                    <div
                        key={post.id}
                        style={{
                            backgroundColor: "white",
                            border: "1px solid #ddd",
                            padding: "20px",
                            marginBottom: "15px",
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        }}
                    >
                        <h2>{post.title}</h2>
                        <p style={{ color: "#666", fontSize: "14px" }}>
                            Created at: {new Date(post.created_at).toLocaleString()}
                        </p>
                        <p style={{ fontWeight: "bold" }}>Upvotes: {post.upvotes}</p>

                        <Link to={`/post/${post.id}`}>
                            <button style={{ backgroundColor: "#0077ff", color: "white", border: "none", borderRadius: "8px", padding: "10px 20px", marginTop: "10px" }}>
                                View Post
                            </button>
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;
