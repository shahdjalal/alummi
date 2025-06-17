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
import Chat from './pages/user/messages/Chat';
import Conversations from './pages/user/messages/Conversations';
import GroupsAdmin from './pages/dashboard/jobs/GroupsAdmin';
import GroupsList from './pages/user/messages/GroupsList';
import GroupChat from './pages/user/messages/GroupChat';
import SendCode from './pages/user/login/SendCode';
import ResetPassword from './pages/user/login/ResetPassword';
import EventsList from './pages/user/events/EventsList';
import EventDetails from './pages/user/events/EventDetails';
import AdminEvents from './pages/dashboard/events/AdminEvents';
import EventAttendees from './pages/dashboard/events/EventAttendees';
import ProtectedAdminRoute from './components/dashboard/ProtectedAdminRoute';
import PublicRoute from './components/dashboard/PublicRoute';
import { ToastContainer } from 'react-toastify';

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/auth",
      element:
    <PublicRoute> <Authlayout /></PublicRoute>  
     
       ,
      children: [
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "sendcode",
          element: <SendCode />,
        },
        {
          path: "reset-password/:token",
          element: <ResetPassword />,
        }
      ]
    },
   { 
    path: "/",
    element:<Userlayout />  ,
  
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
      },{
      path: "/groups",
        element: <GroupsList />,
      }
,{
      path: "/groups/chat/:groupId",
        element: <GroupChat />,
      },
      {
  path: "/events",
  element: <EventsList />
},
{
  path: "/events/:eventId",
  element: <EventDetails />
}
    ]},
    {
      path: "/admin",
      element:
      <ProtectedAdminRoute>
       <Adminlayout />
     </ProtectedAdminRoute>
       ,
      children: [
        {
          path: "jobs",
          element: <AdminJobs />,
        },
         {
          path: "events",
          element: <AdminEvents />,
        },
        {
  path: "/admin/events/:id/attendees",
  element: <EventAttendees />,
}
,
        {
          path: "/admin/jobs/:jobId/applications",
          element: <ApplicationsPage />,
        } ,
         {
          path: "/admin/groups",
          element: <GroupsAdmin />,
        },
       
      ]
    }
  ])
  return (
    <>
      <UserContextProvider>
        <ToastContainer />
      <RouterProvider router={router} />
      </UserContextProvider>
    </>
  )
}

