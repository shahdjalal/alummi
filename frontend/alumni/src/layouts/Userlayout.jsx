import React from 'react'

import { Outlet } from 'react-router-dom'
import CustomNavbar from '../components/user/navbar/CustomNavbar'


export default function Userlayout() {
  return (
    <>
    
    <CustomNavbar />
    <Outlet/>

    
    
    
    </>
  )
}
