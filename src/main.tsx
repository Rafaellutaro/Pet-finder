import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LoginPage from './components/Login.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([

      {
        path: "/",
        element: <App />
      },
      {
        path: "/Login",
        element: <LoginPage />
      },
      {
        path: "/MyPets",
        element: <div>Pets page here</div>
      }

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
