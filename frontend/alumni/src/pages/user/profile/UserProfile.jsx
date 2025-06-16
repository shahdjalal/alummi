import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Container, Card, Button, Badge, Form } from 'react-bootstrap';
import { FaThumbsUp, FaComment, FaRocketchat, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import Loading from '../../../components/loading/Loading';
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";

export default function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const token = localStorage.getItem("userToken");
 

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.id);
    }
  }, [token]);

  useEffect(() => {
    if (currentUserId) {
      fetchUserData();
    }
  }, [userId, currentUserId]);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/users/user/${userId}`, {
        headers: { Authorization: `${token}` }
      });
      setUser(res.data.user);
      setPosts(res.data.posts);
      setIsFollowing(res.data.isFollowing); // ✅ نستخدم القيمة من السيرفر
    } catch (error) {
      toast.error('❌ Failed to fetch user data');
    }
  };

  const handleFollowToggle = async () => {
    try {
      const url = isFollowing
        ? `http://localhost:8000/api/users/unfollow/${userId}`
        : `http://localhost:8000/api/users/follow/${userId}`;

      await axios.put(url, {}, { headers: { Authorization: `${token}` } });
      toast.success(isFollowing ? 'Unfollowed' : 'Followed');
      fetchUserData();
    } catch (error) {
      toast.error('❌ Failed to update follow status');
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.put(`http://localhost:8000/api/posts/like/${postId}`, {}, {
        headers: { Authorization: `${token}` },
      });
      fetchUserData();
    } catch (error) {
      toast.error('❌ Failed to like post');
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      await axios.post(`http://localhost:8000/api/posts/comment/${postId}`, { text: commentText }, {
        headers: { Authorization: `${token}` },
      });
      toast.success('Comment added!');
      fetchUserData();
    } catch (error) {
      toast.error('❌ Failed to add comment');
    }
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };


if (!user) return <Loading />;
  return (
    <Container className="my-5">
      <Card className="p-3 mb-4">
        <div className="d-flex align-items-center">
          <img
            src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
            alt={user.name}
            style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", marginRight: "20px" }}
          />
          <div>
            <h3>{user.name}</h3>
            <p>{user.jobTitle || "No job title"}</p>
            <p>{user.email}</p>
            <p>
              <strong>{user.followers?.length || 0}</strong> followers | 
              <strong> {user.following?.length || 0}</strong> following
            </p>
            {currentUserId !== user._id && (
  <>
    <Button
      variant={isFollowing ? "danger" : "primary"}
      onClick={handleFollowToggle}
      className="mb-2 me-2"
    >
     {isFollowing ? <span><SlUserUnfollow className="me-1" />UnFollow</span> : <span><SlUserFollow className="me-1" />Follow</span>}

    </Button>

    {/* 🟢 زر Chat */}
    <Button 
      variant="secondary" 
      as={Link} 
      to={`/chat/${user._id}`} 
      className="mb-2"
    >
     <FaRocketchat /> Chat
    </Button>
  </>
)}

            <div>
              {user.skills && user.skills.length > 0 && (
                <>
                  <strong>Skills:</strong>
                  {user.skills.map(skill => (
                    <Badge bg="info" key={skill} className="mx-1">{skill}</Badge>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      <h4>User's Posts</h4>
      {posts.length > 0 ? (
        posts.map(post => (
          <Card key={post._id} className="mb-4">
            <Card.Body>
              <Card.Text>{post.text}</Card.Text>
              {post.image && (
                <Card.Img variant="top" src={post.image} style={{ maxHeight: "300px", objectFit: "contain" }} />
              )}
              <div className="d-flex justify-content-between mt-2">
              <Button 
  style={{
   backgroundColor: post.likes.includes(currentUserId) ? "#A41A2F" : "transparent",
    color: post.likes.includes(currentUserId) ? "white" : "#A41A2F",
   borderColor: "#A41A2F"}}
  size="sm" 
  onClick={() => handleLike(post._id)}
>
  <FaThumbsUp /> {post.likes.length}
</Button>

                <Button  style={{ color: '#A41A2F' ,borderColor:'#A41A2F',backgroundColor:'white'}}
                                className="mb-3" size="sm" onClick={() => toggleComments(post._id)}>
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
    name="commentText"
    type="text"
    placeholder="Write a comment..."
    className="me-2"
  />
  <Button type="submit" style={{ backgroundColor: '#A41A2F', border: 'none' }}>
    <FaPaperPlane />
  </Button>
</Form>

              
                  {post.comments.map(comment => (
                    <p key={comment._id}>
                      <strong>{comment.user?.name}:</strong> {comment.text}
                    </p>
                  ))}
  </div>
              )}
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No posts yet.</p>
      )}
    </Container>
  );
}
