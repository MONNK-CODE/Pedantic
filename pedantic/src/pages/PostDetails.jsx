import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase/client";

function PostDetails() {
    const [currentUser, setCurrentUser] = useState(null);
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
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
            setPost(data);
        }
        setLoading(false);
    };

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", postId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching comments:", error);
        } else {
            setComments(data);
        }
    };

    const fetchCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
    };

    useEffect(() => {
        fetchPost();
        fetchComments();
        fetchCurrentUser();
    }, []);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (newComment.trim() === "") return;

        const { data, error } = await supabase
            .from("comments")
            .insert([{ post_id: postId, content: newComment }]);

        if (error) {
            console.error("Error adding comment:", error);
        } else {
            setNewComment("");
            fetchComments(); // Refresh comments
        }
    };

    const handleUpvote = async () => {
        const { data, error } = await supabase
            .from("posts")
            .update({ upvotes: (post.upvotes || 0) + 1 })
            .eq("id", postId)
            .select()
            .single();

        if (error) {
            console.error("Error upvoting:", error);
        } else {
            setPost(data); // Update the post in state
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", postId);

        if (error) {
            console.error("Error deleting post:", error);
        } else {
            navigate("/"); // Go back to home after deleting
        }
    };

    if (loading) return <p>Loading post...</p>;
    if (!post) return <p>Post not found!</p>;

    return (
        <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
            <h1>{post.title}</h1>
            <p>Created at: {new Date(post.created_at).toLocaleString()}</p>
            <p>Upvotes: {post.upvotes}</p>
            {post.image_url && (
                <img
                    src={post.image_url}
                    alt="Post"
                    style={{ width: "100%", maxHeight: "400px", objectFit: "cover", marginBottom: "20px" }}
                />
            )}
            <p>{post.content}</p>

            <div style={{ marginTop: "20px" }}>
                <button onClick={handleUpvote} style={{ marginRight: "10px", padding: "8px 16px" }}>
                    Upvote
                </button>

                {currentUser && currentUser.id === post.user_id && (
                    <>
                        <Link to={`/edit/${post.id}`}>
                            <button style={{ marginRight: "10px", padding: "8px 16px" }}>Edit</button>
                        </Link>

                        <button
                            onClick={handleDelete}
                            style={{ backgroundColor: "red", color: "white", padding: "8px 16px" }}
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>



            <hr style={{ margin: "20px 0" }} />

            <h3>Comments</h3>
            <form onSubmit={handleAddComment} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{ width: "80%", marginRight: "10px", padding: "8px" }}
                />
                <button type="submit" style={{ padding: "8px 16px" }}>
                    Post
                </button>
            </form>

            {comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (
                comments.map((comment) => (
                    <div key={comment.id} style={{ marginBottom: "10px" }}>
                        <p>{comment.content}</p>
                        <small>{new Date(comment.created_at).toLocaleString()}</small>
                    </div>
                ))
            )}
        </div>
    );
}

export default PostDetails;
