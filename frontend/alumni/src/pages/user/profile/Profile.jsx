import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import ProfileMenu from './ProfileMenu'; // ⬅️ تأكدي من المسار حسب مكان الملف

export default function Profile() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* ✅ المينيو بدل السايد بار */}
      <ProfileMenu />

      {/* ✅ المحتوى المتغير حسب الرابط */}
      <Container className="pt-5">
        <Outlet />
      </Container>
    </div>
  );
}
