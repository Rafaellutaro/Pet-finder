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

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
