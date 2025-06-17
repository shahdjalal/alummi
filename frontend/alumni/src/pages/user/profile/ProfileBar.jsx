import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Card, Form, Dropdown } from "react-bootstrap";
import { FaThumbsUp, FaComment, FaPaperPlane, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { IoMdAdd } from "react-icons/io";
import { UserContext } from "../../../components/context/UserContext";
import { jwtDecode } from "jwt-decode";
import ProfileMenu from "./ProfileMenu"; // ✅ القائمة العلوية
import style from './profile.module.css';
import Loading from "../../../components/loading/Loading";
export default function ProfileBar() {
  const { user, successToast, setSuccessToast } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [editPostData, setEditPostData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostFile, setNewPostFile] = useState(null);
  const [newPostPreview, setNewPostPreview] = useState(null);
  const [imagePosition, setImagePosition] = useState({ top: 50, left: 50 });
  const [followers, setFollowers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [listTitle, setListTitle] = useState("Followers");
  const [Follwings, setFollwings] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.id);
    }
  }, [token]);

  const fetchProfileAndPosts = async () => {
    try {
      const profileRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/profile`, {
        headers: { Authorization: `${token}` },
      });

      const postsRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts`, {
        headers: { Authorization: `${token}` },
      });

      const userPosts = postsRes.data.filter(post => post.user._id === profileRes.data.user._id);
      setPosts(userPosts);
    } catch (error) {
      console.error("Error fetching profile or posts", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/like/${postId}`, {}, {
        headers: { Authorization: `${token}` },
      });
      fetchProfileAndPosts();
    } catch (error) {
      toast.error("Failed to like post.");
    }
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleComment = async (postId, commentText) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/comment/${postId}`, { text: commentText }, {
        headers: { Authorization: `${token}` },
      });

      toast.success("Comment added!");
      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? { ...post, comments: [...post.comments, { text: commentText, user: { name: user.name } }] }
            : post
        )
      );
    } catch (error) {
      toast.error("Failed to add comment.");
    }
  };

  const handleEdit = (post) => {
    setEditPostData({ postId: post._id, text: post.text, image: post.image });
    setImagePreview(post.image || null);
    setSelectedFile(null);
    setImagePosition({ top: 50, left: 50 });
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("text", editPostData.text);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/edit/${editPostData.postId}`, formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post updated!");
      setEditPostData({});
      setSelectedFile(null);
      setImagePreview(null);
      fetchProfileAndPosts();
    } catch (error) {
      toast.error("Failed to update post.");
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/posts/delete/${postId}`, {
        headers: { Authorization: `${token}` },
      });
      toast.success("Post deleted!");
      fetchProfileAndPosts();
    } catch (error) {
      toast.error("Failed to delete post.");
    }
  };

  const handleCreatePost = async () => {
    if (!newPostText) return toast.error("Post text is required.");

    try {
      const formData = new FormData();
      formData.append("text", newPostText);
      if (newPostFile) formData.append("image", newPostFile);

      await axios.post(`${process.env.REACT_APP_API_URL}/api/posts`, formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post created!");
      setShowAddModal(false);
      setNewPostText("");
      setNewPostFile(null);
      setNewPostPreview(null);
      fetchProfileAndPosts();
    } catch (error) {
      toast.error("Failed to create post.");
    }
  };

  const fetchFollowers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${user._id}/followers`);
      setFollowers(response.data);
      setListTitle("Followers");
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching followers", err);
    }
  };

  const fetchFollowing = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${user._id}/following`);
      setFollwings(response.data);
      setListTitle("Following");
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching following", err);
    }
  };

  useEffect(() => {
    fetchProfileAndPosts();

    if (successToast) {
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "light"
      });
      setSuccessToast(false);
    }
  }, [successToast]);


if (!user) return <Loading/>;
  return (
    <div className="position-relative">
     
     <Container className="my-5 mb-5">
      <ToastContainer />

      {/* 🟢 معلومات المستخدم */}
      <Row className="align-items-center border-bottom pb-3 mb-4 gap-4">
        <Col xs={3}>
          <img
            src={user.profileImage ? user.profileImage : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&rounded=true&size=128`}
            alt="Profile"
            className="img-fluid rounded-circle"
          />
        </Col>
        <Col>
          <h2 className="fw-bold">{user.name}</h2>
          <p className="text-muted">{user.email}</p>
      
          <p className={`${style.start} fw-bold`}>
    <span style={{ color: '#A41A2F'}}>   {posts.length} posts &nbsp;&nbsp; &nbsp;&nbsp;</span>     
  <span style={{ cursor: 'pointer', color: '#A41A2F' }} onClick={() => fetchFollowers()}>
    {user.followers.length} followers
  </span>
  &nbsp;&nbsp; &nbsp;&nbsp;
  <span style={{ cursor: 'pointer', color: '#A41A2F' }} onClick={() => fetchFollowing()}>
    {user.following.length} following
  </span>
</p>

        </Col>
      </Row>
{/* //skills */}

<div className="border-bottom pb-3 mb-4">
    {/* 💼 Job Title */}
    {user.jobTitle && (
      <p className=" mb-1">Job Title: {user.jobTitle}</p>
    )}

    {/* 🎯 Skills */}
    {/* text-muted  */}
    <p className="mb-1">
      Skills: {user.skills?.length ? user.skills.join(", ") : "N/A"}
    </p>
</div>
      {/* 📝 البوستات */}
      <div className="d-flex justify-content-between align-items-center mb-3">
  <h3 className=" fw-bold" style={{ color: '#A41A2F' }}>My Posts</h3>
  <Button  size="xl" onClick={() => setShowAddModal(true)} style={{ background: '#A41A2F' }}>
  <IoMdAdd />
  Add Post
  </Button>
</div>
{/* follwers list */}

{showModal && (
  <div className="modal show d-block" tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{listTitle}</h5>
          <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <div className="modal-body">
          <ul className="list-unstyled">
            {(listTitle === "Followers" ? followers : Follwings).map((person) => (
              <li key={person._id} className="d-flex align-items-center mb-2">
                <img
                  src={person.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random`}
                  width="40"
                  height="40"
                  className="rounded-circle me-2"
                  alt="User"
                  style={{ objectFit: "cover" }}
                />
                <span>{person.name}</span>
              </li>
            ))}
          </ul>
          {(listTitle === "Followers" ? followers.length : Follwings.length) === 0 && (
            <p>No {listTitle.toLowerCase()} yet.</p>
          )}
        </div>
      </div>
    </div>
  </div>
)}



{/* Modal لإضافة بوست */}
{showAddModal && (
  <div className="modal show d-block" tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add New Post</h5>
          <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
        </div>
        <div className="modal-body">
          <Form.Group className="mb-3">
            <Form.Label>Post Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => {
                setNewPostFile(e.target.files[0]);
                setNewPostPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </Form.Group>

          {newPostPreview && (
            <img
              src={newPostPreview}
              alt="Preview"
              className="img-fluid mb-2"
              style={{ maxHeight: "200px", objectFit: "cover", width: "100%" }}
            />
          )}
        </div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreatePost} style={{ background: '#A41A2F' }}>
            Post
          </Button>
        </div>
      </div>
    </div>
  </div>
)}

      {posts.map((post) => (
        <Card className="mb-4" key={post._id}>
          <Card.Body style={{ boxShadow: '0px 4px 6px #111' }}>
            {/* 🟢 عنوان البوست */}
            <Row className="align-items-center mb-2" >
              <Col xs={10} className="d-flex align-items-center">
                <img
                  src={user.profileImage ? user.profileImage : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&rounded=true&size=128`}
                  alt="Profile"
                  className="rounded-circle me-2"
                  width={40}
                  height={40}
                />
                <h6 className="fw-bold m-0">{user.name}</h6>
              </Col>
              <Col xs={2} className="text-end">
                <Dropdown>
                  <Dropdown.Toggle variant="light" size="xl" id="dropdown-basic">
                    ⋮
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEdit(post)}>Edit</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(post._id)}>Delete</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>

            {/*  تعديل أو عرض */}
            {editPostData.postId === post._id ? (
              <>
                <Form.Control
                  as="textarea"
                  value={editPostData.text}
                  onChange={(e) => setEditPostData({ ...editPostData, text: e.target.value })}
                  className="mb-2"
                />
                <Form.Group controlId="formFile" className="mb-2">
                  <Form.Label>Change Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setSelectedFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }}
                  />
                </Form.Group>

                {/* 🖼️ معاينة + تحكم */}
                {imagePreview && (
                  <>
                    <div
                      style={{
                        width: "100%",
                        height: "200px",
                        overflow: "hidden",
                        position: "relative",
                        border: "1px solid #ccc",
                        marginBottom: "10px",
                      }}
                    >
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: "auto",
                          height: "100%",
                          position: "absolute",
                          top: `${imagePosition.top}%`,
                          left: `${imagePosition.left}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    </div>
                    {/* أزرار التحكم */}
                    <div className="d-flex mb-2">
                      <Button size="sm" onClick={() => setImagePosition(pos => ({ ...pos, top: pos.top - 5 }))}><FaArrowUp /></Button>
                      <Button size="sm" onClick={() => setImagePosition(pos => ({ ...pos, top: pos.top + 5 }))} className="ms-2"><FaArrowDown /></Button>
                      <Button size="sm" onClick={() => setImagePosition(pos => ({ ...pos, left: pos.left - 5 }))} className="ms-2"><FaArrowLeft /></Button>
                      <Button size="sm" onClick={() => setImagePosition(pos => ({ ...pos, left: pos.left + 5 }))} className="ms-2"><FaArrowRight /></Button>
                    </div>
                  </>
                )}
                <Button variant="success" size="sm" onClick={handleSaveEdit} className="me-2">
                  Save
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditPostData({});
                    setSelectedFile(null);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Card.Text>{post.text}</Card.Text>
                {post.image && post.image.trim() && (
                <Card.Img
                variant="top"
                src={post.image}
                style={{ width: "100%", height: "300px", objectFit: "contain", backgroundColor: "#f8f9fa" }}
                onError={(e) => (e.target.style.display = "none")}
              />
              
               
                )}
              </>
            )}

            {/* ❤️ لايك وكومنت */}
            <div className="d-flex align-items-center mt-2">
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2 mb-3"
                onClick={() => handleLike(post._id)}
                  style={{
   backgroundColor: post.likes.includes(currentUserId) ? "#A41A2F" : "transparent",
    color: post.likes.includes(currentUserId) ? "white" : "#A41A2F",
   borderColor: "#A41A2F" }}
              >
                <FaThumbsUp /> {post.likes.length}
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => toggleComments(post._id)}
                style={{ color: '#A41A2F' ,borderColor:'#A41A2F'}}
                className="mb-3"
              >
                <FaComment /> {post.comments.length} Comments
              </Button>
            </div>
          </Card.Body>

          {showComments[post._id] && (
            <Card.Footer className="mb-5"> 
             <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  const commentText = e.target.elements.commentText.value;
                  handleComment(post._id, commentText);
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
                <Button type="submit"  style={{ backgroundColor: '#A41A2F' }}>
                  <FaPaperPlane />
                </Button>
              </Form>
              {post.comments.map((comment) => (
                <p key={comment._id} className="mb-1">
                  <strong>{comment.user ? comment.user.name : "Anonymous"}:</strong> {comment.text}
                </p>
              ))}

             
            </Card.Footer>
          )}
        </Card>
      ))}
    </Container>
    </div>
  );
}






