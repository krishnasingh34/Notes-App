"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar.jsx" 
import Login from "./components/Login.jsx" 
import Signup from "./components/Signup.jsx"
import NotesDashboard from "./components/NotesDashboard.jsx"
import "./styles/App.css"

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<NotesDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
