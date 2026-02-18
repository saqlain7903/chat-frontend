import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("chat_phone");
    localStorage.removeItem("chat_name");
    localStorage.setItem("is_logged_in", "false");
    navigate("/login");
  }; 
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Are you sure you want to logout?</h2>
      <button onClick={handleLogout} style={{ marginRight: "10px" }}>Logout</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default Logout;
