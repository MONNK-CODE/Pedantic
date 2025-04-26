import { useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";

function CreatePost() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title) {
            alert("Title is required!");
            return;
        }

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert("You must be logged in to create a post.");
            return;
        }

        const { data, error } = await supabase
            .from("posts")
            .insert([
                {
                    title,
                    content,
                    image_url: imageUrl,
                    user_id: user.id, // <-- Save the user id!!
                },
            ]);

        if (error) {
            console.error("Error creating post:", error);
            alert("Something went wrong!");
        } else {
            console.log("Post created:", data);
            navigate("/");
        }
    };


    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
            <h2>Create a New Post</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title (required)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                />
                <textarea
                    placeholder="Additional content (optional)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ width: "100%", marginBottom: "10px", padding: "8px", height: "120px" }}
                />
                <input
                    type="text"
                    placeholder="Image URL (optional)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                />
                <button type="submit" style={{ padding: "10px 20px" }}>
                    Create Post
                </button>
            </form>
        </div>
    );
}

export default CreatePost;
