import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LoginPage from './components/Login.tsx'
import Menu from './components/Selection-Menu.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Router-layout/Header-Layout.tsx'
import ProtectedLayout from './components/Router-layout/ProtectedLayout.tsx'
import RegisterCommon from "./components/forms/Register-common.tsx"
import Profile from './components/profile.tsx'
import { UserProvider } from './Interfaces/GlobalUser.tsx'
import Settings from './components/Settings.tsx'
import Pets from './components/Pets.tsx'
import { Outlet } from "react-router-dom";
import Pet from './components/Pet.tsx'
import "./assets/css/Loader.css"
import ProtectedAfterLogin from './components/Router-layout/ProtectedAfterLogin.tsx'

// i realised i did the nesting route wrong when including layout, now it seens correct
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },

      {
        element: <ProtectedLayout />,
        children: [
          { path: "Profile", element: <Profile /> },
          { path: "Settings", element: <Settings /> },
        ]
      },

      {
        element: <ProtectedAfterLogin />,
        children: [
          { path: "Login", element: <LoginPage /> },
          { path: "Register", element: <Menu /> },
          { path: "Register-Comum", element: <RegisterCommon /> },
          { path: "Register-Shelter", element: <div>shelter</div> },
        ]
      },
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
  }
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* @ts-ignore */}
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
