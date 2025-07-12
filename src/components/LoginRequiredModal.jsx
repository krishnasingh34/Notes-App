import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
};

const cardStyle = {
  background: '#fff',
  borderRadius: '12px',
  padding: '2rem 1.5rem 1.5rem 1.5rem',
  minWidth: '320px',
  maxWidth: '90vw',
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  position: 'relative',
  textAlign: 'center',
};

const closeBtnStyle = {
  position: 'absolute',
  top: '12px',
  right: '16px',
  background: 'none',
  border: 'none',
  fontSize: '1.3rem',
  cursor: 'pointer',
  color: '#888',
};

const loginBtnBase = {
  marginTop: '1.5rem',
  padding: '0.7em 2.2em',
  background: 'linear-gradient(90deg, #2177c3 0%, #764ba2 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '45px',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(118,75,162,0.08)',
  transition: 'background 0.2s, color 0.2s, transform 0.2s',
  outline: 'none',
  transform: 'scale(1)',
  display: 'inline-block',
};

const loginBtnHover = {
  transform: 'scale(1.07)',
  background: 'linear-gradient(90deg, #2177c3 0%, #5e3fa2 100%)',
  color: '#fff',
};

export default function LoginRequiredModal({ open, onClose }) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  if (!open) return null;
  return (
    <div style={modalStyle}>
      <div style={cardStyle}>
        <button style={closeBtnStyle} aria-label="Close" onClick={onClose}>&times;</button>
        <h2 style={{ marginBottom: '1rem', color: '#764ba2' }}>Login Required</h2>
        <div style={{ color: '#444', fontSize: '1.08rem' }}>
          Please login first to create or view your notes.
        </div>
        <button
          style={hover ? { ...loginBtnBase, ...loginBtnHover } : loginBtnBase}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => { onClose(); navigate('/login'); }}
        >
          Login
        </button>
      </div>
    </div>
  );
} 