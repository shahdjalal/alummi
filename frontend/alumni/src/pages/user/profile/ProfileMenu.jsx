import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBars, FaRegEdit } from 'react-icons/fa';
import { FcDataConfiguration } from "react-icons/fc";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { CiImageOn } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";

export default function ProfileMenu() {
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 900
    }}>
      <Dropdown>
        <Dropdown.Toggle variant="light" id="profile-menu">
         <FontAwesomeIcon icon={faGear}   style={{ color: 'black', fontSize: '40px' }}/>
          {/* <FcDataConfiguration size={50} style={{color:'black'}} /> */}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item as={Link} to="/profile/info"><CgProfile /> Profile</Dropdown.Item>
          <Dropdown.Item as={Link} to="/profile/image"><CiImageOn /> Image</Dropdown.Item>
          <Dropdown.Item as={Link} to="/profile/edit"><FaRegEdit /> Edit</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
