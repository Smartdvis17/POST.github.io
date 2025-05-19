
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Login } from "./pages/Login";
import { Post } from "./pages/Post";
import { UserProvider } from './context/UserContext.jsx';
import React from 'react';
import './index.css'
import { PrivateRoute } from './navigation/PrivateRoute.jsx';
import { Route } from 'react-router-dom';



       
    const router = createBrowserRouter([
   {
        path: "/",
        element: <Login/>,
      },{
        index: true,
        element:<Login />
      },
    
      {
        path: "/post",
        element: <PrivateRoute><Post /></PrivateRoute>
      },
         
 
    ]);
 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);