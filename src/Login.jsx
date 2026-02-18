import { useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000");

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const login = async () => {
    if (!phone || !name) return alert("Enter name & phone");

    await axios.post("http://localhost:5000/api/auth/register", {
      phone,
      name,
    });

    socket.emit("join", phone);

    onLogin({ phone, name });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}
