
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Login } from "./pages/Login";
import { Post } from "./pages/Post";
import { NotFound } from "./pages/NotFound";
import { UserProvider } from './context/UserContext.jsx';
import React from 'react';
import './index.css'
import { PrivateRoute } from './navigation/PrivateRoute.jsx';
import { PublicRoute } from './navigation/PublicRoute.jsx';
import { Route } from 'react-router-dom';




    const router = createBrowserRouter([
   {
        path: "/",
        element: <PublicRoute><Login/></PublicRoute>,
      },{
        index: true,
        element: <PublicRoute><Login /></PublicRoute>
      },

      {
        path: "/post",
        element: <PrivateRoute><Post /></PrivateRoute>
      },
      {
        path: "*",
        element: <NotFound />
      },

    ]);
 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);