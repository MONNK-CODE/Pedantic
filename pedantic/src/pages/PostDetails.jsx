import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchPost();
        fetchComments();
        fetchUser();
    }, [id]);

    const fetchPost = async () => {
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !data) {
            console.error("Error fetching post:", error);
            setPost(null);
        } else {
            setPost(data);
        }
        setLoading(false);
    };

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", id)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching comments:", error);
        } else {
            setComments(data);
        }
    };

    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase
            .from("comments")
            .insert([{ content: comment, post_id: id }]);

        if (error) {
            console.error("Error adding comment:", error);
        } else {
            setComment("");
            fetchComments();
        }
    };

    const handleUpvote = async () => {
        const { data, error } = await supabase
            .from("posts")
            .update({ upvotes: post.upvotes + 1 })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error upvoting:", error);
        } else {
            setPost(data);
        }
    };

    const handleDelete = async () => {
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting post:", error);
        } else {
            navigate("/");
        }
    };

    const handleEdit = () => {
        navigate(`/edit/${id}`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!post) {
        return <h1>Post not found!</h1>;
    }

    return (
        <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
            <h1>{post.title}</h1>
            {post.image_url && (
                <img src={post.image_url} alt="Post" style={{ width: "100%", borderRadius: "8px", marginTop: "10px" }} />
            )}
            <p style={{ marginTop: "10px" }}>{post.content}</p>
            <p style={{ fontWeight: "bold" }}>Upvotes: {post.upvotes}</p>
            <button onClick={handleUpvote} style={{ marginTop: "10px", padding: "10px 20px", borderRadius: "8px", backgroundColor: "#0077ff", color: "white", border: "none" }}>
                Upvote
            </button>

            {/* Only show edit/delete buttons if the user owns the post */}
            {user && post.user_id === user.id && (
                <div style={{ marginTop: "20px" }}>
                    <button onClick={handleEdit} style={{ marginRight: "10px", padding: "10px 20px", borderRadius: "8px", backgroundColor: "#28a745", color: "white", border: "none" }}>
                        Edit Post
                    </button>
                    <button onClick={handleDelete} style={{ padding: "10px 20px", borderRadius: "8px", backgroundColor: "#dc3545", color: "white", border: "none" }}>
                        Delete Post
                    </button>
                </div>
            )}

            <h2 style={{ marginTop: "30px" }}>Comments</h2>
            <form onSubmit={handleCommentSubmit} style={{ marginBottom: "20px" }}>
                <textarea
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ width: "100%", height: "80px", padding: "10px", borderRadius: "8px", marginBottom: "10px" }}
                />
                <button type="submit" style={{ padding: "10px 20px", borderRadius: "8px", backgroundColor: "#0077ff", color: "white", border: "none" }}>
                    Post Comment
                </button>
            </form>

            {comments.length > 0 ? (
                comments.map((c) => (
                    <div key={c.id} style={{ backgroundColor: "#f9f9f9", padding: "10px", borderRadius: "8px", marginBottom: "10px" }}>
                        {c.content}
                    </div>
                ))
            ) : (
                <p>No comments yet.</p>
            )}
        </div>
    );
}

export default PostDetails;