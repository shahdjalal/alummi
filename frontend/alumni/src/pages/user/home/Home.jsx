import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Container,
  Form,
  Modal,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import {
  FaThumbsUp,
  FaComment,
  FaPlus,
  FaSearch,
  FaPaperPlane,
} from "react-icons/fa";
import FollowSuggestions from "../../../components/FollowSuggestions";
import styles from "./Home.module.css";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../../../components/context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Loading from "../../../components/loading/Loading";

export default function Home() {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const token = localStorage.getItem("userToken");
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.id);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [userId, currentUserId]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts`, {
        headers: { Authorization: `${token}` },
      });
      setPosts(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Failed to fetch posts");
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/posts/like/${postId}`,
        {},
        {
          headers: { Authorization: `${token}` },
        }
      );
      fetchPosts();
    } catch (error) {
      toast.error("❌ Failed to like post");
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/comment/${postId}`,
        { text: commentText },
        { headers: { Authorization: `${token}` } }
      );

      toast.success("Comment added!");

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  { text: commentText, user: { name: user.name } },
                ],
              }
            : post
        )
      );
    } catch (error) {
      toast.error("❌ Failed to add comment");
    }
  };

  const handleAddPost = async () => {
    try {
      const formData = new FormData();
      formData.append("text", newPostText);
      if (newPostImage) {
        formData.append("image", newPostImage);
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchPosts();
      setShowAddModal(false);
      setNewPostText("");
      setNewPostImage(null);
    } catch (error) {
      toast.error("❌ Failed to add post");
    }
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const filteredPosts = posts.filter((post) =>
    post.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!token || !user) {
    return (
      <Container className="my-5">
        <p className="text-muted">Please log in to view posts.</p>
      </Container>
    );
  }
  if (isLoading) return <Loading />;
  return (
    <Container className="my-5">
      <ToastContainer />
      <div
        style={{
          border: "1px solid rgba(0, 0, 0, 0.277)  ",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.277)",
          borderRadius: "1%",
        }}
        className="p-4"
      >
        <div
          className="d-flex align-items-center justify-content-between mb-4"
          style={{ flexWrap: "wrap" }}
        >
          <div className="d-flex align-items-center mb-2" style={{ flex: 1 }}>
            <img
              src={
                user.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=A41A2F&color=fff&rounded=true&size=128`
              }
              alt="Profile"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: "10px",
              }}
            />
            <Link
              to="/profile/info"
              style={{
                fontWeight: "bold",
                color: "#A41A2F",
                textDecoration: "none",
                fontSize: "18px",
              }}
            >
              {user.name}
            </Link>
          </div>
<div className={`d-flex align-items-center justify-content-center mb-2 ${styles.searchPost}`} style={{ flex: 1 }}>
  <InputGroup style={{ maxWidth: '300px', width: '100%' }}>
    <FormControl
      placeholder="Search posts..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className={styles.searchInput}
    />
    <Button variant="outline-secondary" className={styles.searchInput}>
      <FaSearch />
    </Button>

    {/* زر بحث مخصص للموبايل */}
    <Button
      variant="outline-secondary"
      className={styles.searchIcon}
      onClick={() => {
        const query = prompt("🔍 Search posts:");
        if (query !== null) setSearchQuery(query);
      }}
    >
      <FaSearch />
    </Button>
  </InputGroup>
</div>


          <div
            className="d-flex align-items-center justify-content-end mb-2"
            style={{ flex: 1 }}
          >
            <Button
              style={{ backgroundColor: "#A41A2F", borderColor: "white" }}
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus /> Add Post
            </Button>
          </div>
        </div>

        {filteredPosts.map((post) => (
          <Card key={post._id} className="mb-4 shadow-sm">
            <Card.Header
              style={{
                backgroundColor: "#A41A2F",
                color: "white",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
  src={
    post.user?.profileImage
      ? `${import.meta.env.VITE_API_URL}/${post.user.profileImage}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          post.user?.name
        )}&background=A41A2F&color=fff&rounded=true&size=128`
  }
  alt="Profile"
  style={{
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "10px",
    objectFit: "cover",
  }}
  onError={(e) => (e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    post.user?.name
  )}&background=A41A2F&color=fff&rounded=true&size=128`)}
/>

              <Link
                to={`/profile/${post.user?._id}`}
                style={{ color: "white", textDecoration: "none" }}
              >
                <strong>{post.user?.name}</strong>
              </Link>
            </Card.Header>
            <Card.Body>
              <Card.Text>{post.text}</Card.Text>
             {post.image && (
  <Card.Img
    variant="top"
    src={`${import.meta.env.VITE_API_URL}/${post.image}`}
    style={{ maxHeight: "300px", objectFit: "contain" }}
    onError={(e) => (e.target.style.display = "none")}
  />
)}

              <div className="d-flex justify-content-between mt-2">
                <Button
                  size="sm"
                  style={{
                    backgroundColor: post.likes.includes(currentUserId)
                      ? "#A41A2F"
                      : "transparent",
                    color: post.likes.includes(currentUserId)
                      ? "white"
                      : "#A41A2F",
                    borderColor: "#A41A2F",
                  }}
                  onClick={() => handleLike(post._id)}
                >
                  <FaThumbsUp /> {post.likes.length}
                </Button>
                <Button
                  variant="outline-dark"
                  className={`${styles.comment}`}
                  size="sm"
                  onClick={() => toggleComments(post._id)}
                >
                  <FaComment /> {post.comments.length} Comments
                </Button>
              </div>

              {showComments[post._id] && (
                <div className="mt-3">
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const text = e.target.elements.commentText.value;
                      handleComment(post._id, text);
                      e.target.reset();
                    }}
                    className="d-flex align-items-center"
                  >
                    <Form.Control
                      type="text"
                      name="commentText"
                      placeholder="Write a comment..."
                      className="mt-2"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="mt-2"
                      style={{
                        color: "#A41A2F",
                        border: "1px solid #A41A2F",
                        backgroundColor: "white",
                      }}
                    >
                      <FaPaperPlane />
                    </Button>
                  </Form>
                  {post.comments.map((comment) => (
                    <p key={comment._id}>
                      <strong>{comment.user?.name}:</strong> {comment.text}
                    </p>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Text</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Image (optional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setNewPostImage(e.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleAddPost}>
            Post
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
