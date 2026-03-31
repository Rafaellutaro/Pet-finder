import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LoginPage from './components/Login.tsx'
import RegisterPage from './components/RegisterPage.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Router-layout/Header-Layout.tsx'
import ProtectedLayout from './components/Router-layout/ProtectedLayout.tsx'
// import RegisterCommon from "./components/forms/Register-common.tsx"
import Profile from './components/profile.tsx'
import { UserProvider } from './Interfaces/GlobalUser.tsx'
import Settings from './components/Settings.tsx'
import Pets from './components/Pets.tsx'
import { Outlet } from "react-router-dom";
import Pet from './components/Pet.tsx'
import "./assets/css/Loader.css"
import ProtectedAfterLogin from './components/Router-layout/ProtectedAfterLogin.tsx'
import FooterLayout from './components/Router-layout/Footer-Layout.tsx'
import PetChat from './components/PetChat.tsx'
import Chat from './components/Chat.tsx'
import PetAdoptionSteps from './components/PetAdoptionSteps.tsx'
import { Analytics } from "@vercel/analytics/react"
import { GoogleOAuthProvider } from '@react-oauth/google';
import Toastify from './components/reusable/Toastify.tsx' // stupid t

// i realised i did the nesting route wrong when including layout, now it seens correct
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <FooterLayout />,
        children: [
          { index: true, element: <App /> },
          {
            path: "Pets",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <Pets />
              },
              {
                path: ":id",
                element: <Pet />
              }
            ]
          },
        ]
      },

      {
        element: <ProtectedLayout />,
        children: [
          { path: "Profile", element: <Profile /> },
          { path: "Settings", element: <Settings /> },
          { path: "PetAdoption/:id", element: <PetAdoptionSteps /> },
          {
            path: "Chat",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <Chat />
              },
              {
                path: ":id",
                element: <PetChat />
              }
            ]
          },
        ]
      },

      {
        element: <ProtectedAfterLogin />,
        children: [
          { path: "Login", element: <LoginPage /> },
          { path: "RegisterPage", element: <RegisterPage /> },
        ]
      },
    ]
  }
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* @ts-ignore */}
    <UserProvider>
      <Toastify/>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <RouterProvider router={router} />
        <Analytics />
      </GoogleOAuthProvider>
    </UserProvider>
  </StrictMode>,
)
