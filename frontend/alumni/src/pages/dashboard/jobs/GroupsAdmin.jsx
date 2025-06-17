import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, ListGroup, Button, Modal, Image, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
export default function GroupsAdmin() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newBatchYear, setNewBatchYear] = useState("");
  const token = localStorage.getItem("userToken");
const [approvedIds, setApprovedIds] = useState([]);
const navigate = useNavigate();


  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/groups`, {
        headers: { Authorization: `${token}` },
      });
      setGroups(res.data);
    } catch (err) {
      console.error("Error fetching groups", err);
    }
  };

  const handleOpenModal = (group) => {
    setSelectedGroup(group);
    setShowModal(true);
  };

const handleApprove = async (userId, groupId) => {
  console.log("Approving:", userId, groupId); // ✅ للتأكد من الضغط
  if (!userId || !groupId) return;

  try {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/groups/approve/${groupId}/${userId}`, null, {
      headers: { Authorization: `${token}` },
    });
     setApprovedIds(prev => [...prev, userId]);
    fetchGroups();
  } catch (err) {
    console.error("Error approving user", err);
  }
};


  const handleCreateGroup = async () => {
    if (!newBatchYear.trim()) return;
    try {
      await axios.post(
       ` ${import.meta.env.VITE_API_URL}/api/groups/create`,
        { batchYear: newBatchYear },
        { headers: { Authorization: `${token}` } }
      );
      setNewBatchYear("");
      fetchGroups();
    } catch (err) {
      console.error("Error creating group", err);
    }
  };

 const handleDeleteGroup = async (groupId) => {
  if (!window.confirm("Are you sure you want to delete this group?")) return;

  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/groups/${groupId}`, {
      headers: { Authorization: `${token}` }
    });
    // حدّثي القائمة بعد الحذف
    setGroups((prev) => prev.filter((g) => g._id !== groupId));
  } catch (err) {
    console.error("❌ Failed to delete group", err);
  }
};

  return (
    <Container className="my-4">
      <h4>Groups Management</h4>

      <Form className="d-flex my-3">
        <Form.Control
          type="text"
          placeholder="Enter batch year (e.g. 2023)"
          value={newBatchYear}
          onChange={(e) => setNewBatchYear(e.target.value)}
        />
        <Button className="ms-2" onClick={handleCreateGroup}>
          ➕ Create Group
        </Button>
      </Form>

      <ListGroup>
        {groups.map((group) => (
          <ListGroup.Item
            key={group._id}
            className="d-flex justify-content-between align-items-center"
          >
            <span>🎓 Batch {group.batchYear}</span>
            <div>
              <Button
                variant="primary"
                size="sm"
                className="me-2"
                onClick={() => handleOpenModal(group)}
              >
                View Members & Requests
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteGroup(group._id)}
              >
                🗑 Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Modal لعرض الأعضاء والطلبات */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Members & Join Requests – Batch {selectedGroup?.batchYear}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>👥 Members</h6>
          <ListGroup className="mb-3">
            {selectedGroup?.members?.map((member) => (
          <ListGroup.Item key={member._id} className="d-flex align-items-center">
  <Image
    src={member.profileImage || `https://ui-avatars.com/api/?name=${member.name}`}
    roundedCircle
    width={35}
    height={35}
    className="me-2"
    style={{ cursor: "pointer" }}
    onClick={() => navigate(`/profile/${member._id}`)}
  />
  <span
    style={{ cursor: "pointer" }}
    onClick={() => navigate(`/profile/${member._id}`)}
  >
    {member.name}
  </span>
</ListGroup.Item>

            ))}
          </ListGroup>

          <h6>📨 Pending Requests</h6>
     <ListGroup>
  {selectedGroup?.pendingRequests?.map((user) => (
    <ListGroup.Item key={user._id} className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <Image
          src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}`}
          roundedCircle
          width={35}
          height={35}
          className="me-2"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/profile/${user._id}`)}
        />
        <span
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/profile/${user._id}`)}
        >
          {user.name}
        </span>
      </div>
      <Button
        variant="success"
        size="sm"
        onClick={() => handleApprove(user._id, selectedGroup._id)}
        disabled={approvedIds.includes(user._id)}
      >
        {approvedIds.includes(user._id) ? "✅ Approved" : "Approve"}
      </Button>
    </ListGroup.Item>
  ))}
</ListGroup>



        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
