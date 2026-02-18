
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./Chat.css";

import { IoVideocamOutline, IoAttach } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdKeyboardVoice } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

const socket = io("http://localhost:5000");

export default function Chat() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  const msgRef = useRef(null);

  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const p = localStorage.getItem("chat_phone");
    const n = localStorage.getItem("chat_name");
    const l = localStorage.getItem("is_logged_in");

    if (l === "true" && p && n) {
      setPhone(p);
      setName(n);
      setLoggedIn(true);
      socket.emit("join", p);
      loadContacts(p);
    }
  }, []);

  const login = async () => {
    if (!phone || !name) return alert("Enter name & phone");

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        phone,
        name,
      });

      localStorage.setItem("chat_phone", phone);
      localStorage.setItem("chat_name", name);
      localStorage.setItem("is_logged_in", "true");

      setLoggedIn(true);
      socket.emit("join", phone);
      loadContacts(phone);
    } catch (err) {
      alert("Login failed. Try again.");
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setContacts([]);
    setMessages([]);
    setSelected(null);
  };

  const loadContacts = async (p = phone) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/contacts/${p}`
      );
      setContacts(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const addContact = async () => {
    if (!contactName || !contactPhone)
      return alert("Enter contact name & phone");

    try {
      await axios.post(
        "http://localhost:5000/api/contacts/add-contact",
        {
          userPhone: phone,
          contactName,
          contactPhone,
        }
      );

      setContactName("");
      setContactPhone("");
      loadContacts();
    } catch (err) {
      alert("Failed to add contact");
    }
  };

  const openChat = async (contactPhone) => {
    setSelected(contactPhone);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/messages/${phone}/${contactPhone}`
      );
      setMessages(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data.from === selected || data.to === selected) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => socket.off("receive_message");
  }, [selected]);

  const sendMessage = () => {
    if (!msg || !selected) return;

    const data = {
      from: phone,
      to: selected,
      message: msg,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };

    socket.emit("send_message", data);
    setMessages((prev) => [...prev, data]);
    setMsg("");
  };

  if (!loggedIn) {
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

  return (
    <div className="chat-main-container">

      <div className={`contact-list ${selected ? "hide-mobile" : ""}`}>
        <div className="top">
          <h2>ChatApp</h2>
          <MdOutlineAddPhotoAlternate size={28} />
        </div>

        <div className="contact-header">
          <input
            className="search-box"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ⋮
          </button>

          {menuOpen && (
            <div className="menu-dropdown">
              <input
                placeholder="Contact Name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
              <input
                placeholder="Contact Phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
              <button onClick={addContact}>Add</button>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>

        {contacts
          .filter(
            (c) =>
              (c.name || "")
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              (c.phone || "").includes(search)
          )
          .map((c, i) => (
            <div
              key={i}
              className="contact-item"
              onClick={() => openChat(c.phone)}
            >
              <b>{c.name}</b>
              <div>{c.phone}</div>
            </div>
          ))}
      </div>

      <div className={`chat-window ${!selected ? "no-bg" : ""}`}>
        <div className="chat-header">
          {selected && (
            <>
              <button
                className="back-btn"
                onClick={() => setSelected(null)}
              >
                ⬅
              </button>

              <div className="chat-user-info">
                <h3>
                  {contacts.find((c) => c.phone === selected)?.name ||
                    "Unknown"}
                </h3>
                <span>{selected}</span>
              </div>

              <div className="three">
                <IoVideocamOutline size={26} />
                <IoIosCall size={26} />
                <BsThreeDotsVertical size={24} />
              </div>
            </>
          )}
        </div>

        {!selected && (
          <div className="no-chat-selected">
            <h3>Open a chat</h3>
          </div>
        )}

        {selected && (
          <>
            <div className="chat-messages" ref={msgRef}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`chat-bubble ${m.from === phone ? "sent" : "received"
                    }`}
                >
                  <div>{m.message}</div>
                  <small>{m.time}</small>
                </div>
              ))}
            </div>

            <div className="chat-input-box">
              <input
                placeholder="Type message..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <IoAttach size={24} />
              <MdKeyboardVoice size={24} />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
