import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";

function EditPost() {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchPost = async () => {
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("id", postId)
            .single();

        if (error) {
            console.error("Error fetching post:", error);
        } else {
            setTitle(data.title);
            setContent(data.content);
            setImageUrl(data.image_url);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPost();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!title) {
            alert("Title is required!");
            return;
        }

        const { error } = await supabase
            .from("posts")
            .update({ title, content, image_url: imageUrl })
            .eq("id", postId);

        if (error) {
            console.error("Error updating post:", error);
            alert("Something went wrong!");
        } else {
            navigate(`/post/${postId}`);
        }
    };

    if (loading) return <p>Loading post...</p>;

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
            <h2>Edit Post</h2>
            <form onSubmit={handleUpdate}>
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
                    Update Post
                </button>
            </form>
        </div>
    );
}

export default EditPost;
