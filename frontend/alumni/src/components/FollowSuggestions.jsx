import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
export default function FollowSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const token = localStorage.getItem('userToken');
const navigate=useNavigate()
  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/suggestions`, {
        headers: { Authorization: `${token}` },
      });
      setSuggestions(res.data);
      console.log("Fetched Suggestions:", res.data);

    } catch (error) {
      toast.error('❌ Failed to fetch suggestions');
    }
  };

  const handleFollow = async (userId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/follow/${userId}`, {}, {
        headers: { Authorization: `${token}` },
      });
      toast.success('✅ Followed');
      fetchSuggestions(); // تحديث الاقتراحات بعد الفولو
    } catch (error) {
      toast.error('❌ Failed to follow');
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };

  return (
    <div className="my-4">
    <h4>Suggested People to Follow</h4>
    <div className="d-flex flex-wrap">
      {suggestions.map(user => (
        <Card key={user._id} style={{ width: '200px', margin: '10px' }}>
          <Card.Img
            variant="top"
            src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
            style={{ height: "150px", objectFit: "cover" }}
          />
          <Card.Body>
          <Card.Title>
          <Button variant="link" onClick={() => navigate(`/profile/${user._id}`)}>
  {user.name}
</Button>

</Card.Title>

            <Card.Text>{user.jobTitle || "No job title"}</Card.Text>
            <Button size="sm" variant="primary" onClick={() => handleFollow(user._id)}>Follow</Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  </div>
  
  );
}
