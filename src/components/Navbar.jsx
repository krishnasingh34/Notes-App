import React, { useEffect, useState } from "react";
import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showLogoutMsg, setShowLogoutMsg] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    getSession();
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async (e) => {
    if (e && e.target && typeof e.target.blur === 'function') e.target.blur();
    await supabase.auth.signOut();
    setShowLogoutMsg(true);
    setTimeout(() => {
      setShowLogoutMsg(false);
      window.location.reload();
    }, 3000);
  };

  // Get username (prefer name, fallback to email)
  const username = user?.user_metadata?.name || user?.email || "User";

  return (
    <nav className="navbar">
      <div className="navbar-title">📝Notes</div>
      <div className="navbar-links">
        {user ? (
          <>
            <button className="navbar-btn" onClick={handleLogout}>Logout</button>
            <div className="navbar-welcome">Welcome, {username}!</div>
            {showLogoutMsg && (
              <div className="navbar-logout-msg">Logged out successfully!</div>
            )}
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-btn">Login</Link>
            {showLogoutMsg && (
              <div className="navbar-logout-msg">User logged out successfully</div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
