import React from "react";
import './Login.css'
export default function Login({ phone, name, setPhone, setName, login }) {
  return (
    <div className="login-container">
      <h2>Login</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="phone-container">
        <select>
          <option value="+91">+91</option>
          <option value="+1">+1</option>
        </select>
        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <button onClick={login}>Login</button>
    </div>
  );
}
