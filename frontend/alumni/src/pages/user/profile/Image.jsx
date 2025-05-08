import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import UserContextProvider, { UserContext } from '../../../components/context/UserContext';



export default function Image() {
  const { register, handleSubmit } = useForm();
  const { user, isLoading, setUser } = useContext(UserContext);

  const [isUpdating, setIsUpdating] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImagePreview(URL.createObjectURL(file));
  };

  const updateImage = async (data) => {
    const formData = new FormData();
    formData.append('profileImage', data.image[0]); // ✅ لاحظ الاسم حسب الباك اند
    const token = localStorage.getItem('userToken');

    try {
      setIsUpdating(true);
      const response = await axios.post(
        'http://localhost:8000/api/auth/upload-profile-image',
        formData,
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        toast.success('✅ Image updated successfully');
        setUser((prev) => ({ ...prev, profileImage: response.data.profileImage }));
      }
    } catch (err) {
      console.log(err);
      toast.error('❌ Error updating image');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div>loading...</div>
  }

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center p-3" style={{ minHeight: '80vh' }}>
      <Form onSubmit={handleSubmit(updateImage)} encType="multipart/form-data"
        className="text-center p-4 border rounded shadow-lg bg-transparent"
        style={{ backdropFilter: "blur(10px)", maxWidth: "100%", width: "50%", borderColor: "#A41A2F " }}
      >
        <h1 className="mb-4" style={{ color: "#A41A2F " }}>Update Profile Image</h1>
        
        <Form.Group controlId="updateImage" className="mb-3">
          <Form.Label className="fw-bold text-dark">Choose Image</Form.Label>
          <Form.Control type="file" {...register('image')} onChange={handleImageChange} className="form-control" />
        </Form.Group>

        <div className="d-flex justify-content-center mb-3">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="rounded-circle shadow"
              style={{ width: '100%', maxWidth: '150px', height: '150px', objectFit: 'cover', border: "3px #A41A2F" }} 
            />
          ) : user && user.profileImage ? (
            <img src={user.profileImage} alt="User" className="rounded-circle shadow"
              style={{ width: '100%', maxWidth: '150px', height: '150px', objectFit: 'cover', border: "3px solid ##A41A2F " }} 
            />
          ) : (
            <h5 className="text-muted">No Profile Image</h5>
          )}
        </div>

        <Button type="submit" disabled={isUpdating} className="w-100" style={{ backgroundColor: "#A41A2F ", borderColor: "#A41A2F " }}>
          {isUpdating ? 'Updating...' : 'Update'}
        </Button>
      </Form>
    </Container>
  );
}
