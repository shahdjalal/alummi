import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Register from './pages/user/register/Register';
import Authlayout from './layouts/Authlayout';
import Userlayout from './layouts/Userlayout';
import Home from './pages/user/home/Home';
import Login from './pages/user/login/Login';
import Profile from './pages/user/profile/Profile';
import ProfileBar from './pages/user/profile/ProfileBar';
import Edit from './pages/user/profile/Edit';
import ImageUpload from './pages/user/profile/Image';
import UserContextProvider from './components/context/UserContext';
import Adminlayout from './layouts/Adminlayout';
import AdminJobs from './pages/dashboard/jobs/AdminJobs';
import ApplicationsPage from './pages/dashboard/jobs/ApplicationsPage';
import JobsList from './pages/user/jobs/JobList';
import JobDetails from './pages/user/jobs/JobDetails';
import UserProfile from './pages/user/profile/UserProfile';
import Chat from './pages/messages/Chat';
import Conversations from './pages/messages/Conversations';

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/auth",
      element:
       <Authlayout />
     
       ,
      children: [
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        }
      ]
    },
   { 
    path: "/",
    element:<UserContextProvider><Userlayout /></UserContextProvider>  ,
  
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
        children:[
          {
            path:"info",
            element: <ProfileBar />
          },
          {
            path:"image",
            element: <ImageUpload />
          },
          {
            path:"edit",
            element: <Edit />
          }


        ],
        
      },
      {
        path: "/profile/:userId",
        element: <UserProfile />
      },
     
      {
        path: "/jobs",
        element: <JobsList />
      },
      {
        path: "/jobs/:jobId",
        element: <JobDetails />
      },{
        path: "/chat/:userId",
        element: <Chat />,
      },{
      path: "/chat",
        element: <Conversations />,
      }

    ]},
    {
      path: "/admin",
      element:
       <Adminlayout />
     
       ,
      children: [
        {
          path: "jobs",
          element: <AdminJobs />,
        },
        {
          path: "/admin/jobs/:jobId/applications",
          element: <ApplicationsPage />,
        }
       
      ]
    }
  ])
  return (
    <>
      
      <RouterProvider router={router} />
    </>
  )
}

