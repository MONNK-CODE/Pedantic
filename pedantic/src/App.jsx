import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PostDetails from "./pages/PostDetails";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";


function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/post/:postId" element={<PostDetails />} />
                <Route path="/edit/:postId" element={<EditPost />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}


export default App;
