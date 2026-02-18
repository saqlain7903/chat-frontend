import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import './Chat.css'

import Login from "./Login";
import ContactList from "./ContactList";
import ChatWindow from "./ChatWindow";

const socket = io("http://localhost:5000");

 function Chat() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [contactInput, setContactInput] = useState("");
  const [contacts, setContacts] = useState([]);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  const msgRef = useRef(null);

  useEffect(() => {
    msgRef.current?.scrollTo(0, msgRef.current.scrollHeight);
  }, [messages]);

  useEffect(() => {
    const p = localStorage.getItem("chat_phone");
    const n = localStorage.getItem("chat_name");
    if (localStorage.getItem("is_logged_in") === "true") {
      setPhone(p);
      setName(n);
      setLoggedIn(true);
      socket.emit("join", p);
      loadContacts(p);
    }
  }, []);

  const login = async () => {
    if (!phone || !name) return alert("Enter name & phone");
    await axios.post("http://localhost:5000/api/auth/register", { phone, name });
    localStorage.setItem("chat_phone", phone);
    localStorage.setItem("chat_name", name);
    localStorage.setItem("is_logged_in", "true");
    setLoggedIn(true);
    socket.emit("join", phone);
    loadContacts(phone);
  };

  const logout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setContacts([]);
    setMessages([]);
    setSelected(null);
  };

  const loadContacts = async (p = phone) => {
    const res = await axios.get(`http://localhost:5000/api/contacts/${p}`);
    setContacts(res.data);
  };

  const addContact = async () => {
    await axios.post("http://localhost:5000/api/contacts/add-contact", {
      userPhone: phone,
      contactPhone: contactInput,
    });
    setContactInput("");
    loadContacts();
  };

  const openChat = async (contactPhone) => {
    setSelected(contactPhone);
    const res = await axios.get(
      `http://localhost:5000/api/messages/${phone}/${contactPhone}`
    );
    setMessages(res.data);
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
      }),
    };
    socket.emit("send_message", data);
    setMessages((prev) => [...prev, data]);
    setMsg("");
  };

  if (!loggedIn)
    return (
      <Login
        phone={phone}
        name={name}
        setPhone={setPhone}
        setName={setName}
        login={login}
      />
    );

  return (
    <div className="chat-main-container">
      <ContactList
        contacts={contacts}
        search={search}
        setSearch={setSearch}
        openChat={openChat}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        contactInput={contactInput}
        setContactInput={setContactInput}
        addContact={addContact}
        logout={logout}
        selected={selected}
      />

      <ChatWindow
        selected={selected}
        setSelected={setSelected}
        messages={messages}
        phone={phone}
        msg={msg}
        setMsg={setMsg}
        sendMessage={sendMessage}
        msgRef={msgRef}
      />
    </div>
  );
}

export default Chat