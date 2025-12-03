import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LoginPage from './components/Login.tsx'
import Menu from './components/Selection-Menu.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Header-Layout.tsx'
import RegisterCommon from "./components/registers-forms/Register-common.tsx"
import Profile from './components/profile.tsx'
import { UserProvider } from './Interfaces/GlobalUser.tsx'
import RegisterPet from './components/registers-forms/Register-Pet.tsx'
import Settings from './components/Settings.tsx'

const router = createBrowserRouter([

      {
        path: "/",
        element: <Layout><App /></Layout>
      },
      {
        path: "/Login",
        element: <Layout><LoginPage /></Layout>
      },
      {
        path: "/Register",
        element: <Layout><Menu /></Layout>
      },
      {
        path: "/Register-Comum",
        element: <Layout><RegisterCommon /></Layout>
      },
      {
        path: "/Register-Shelter",
        element: <div>shelter</div>
      },
      {
        path: "/Profile",
        element: <Layout><Profile /></Layout>
      },
      {
        path: "/MyPets",
        element: <div>Pets page here</div>
      },
      {
        path: "/addPet",
        element: <Layout><RegisterPet /></Layout>
      },
      {
        path: "/Settings",
        element: <Layout><Settings /></Layout>
      },

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* @ts-ignore */}
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
