import React from "react";
import { IoVideocamOutline, IoAttach } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdKeyboardVoice } from "react-icons/md";
import './Chatwin.css'
export default function ChatWindow({
  selected,
  setSelected,
  messages,
  phone,
  msg,
  setMsg,
  sendMessage,
  msgRef,
}) {
  return (
    <div className={`chat-window ${!selected ? "hide-mobile" : ""}`}>
      <div className="chat-header">
        {selected && (
          <button className="back-btn" onClick={() => setSelected(null)}>
            ⬅
          </button>
        )}
        <h3>{selected || "Select Contact"}</h3>

        <div className="three">
          <IoVideocamOutline size={28} />
          <BsThreeDotsVertical size={28} />
        </div>
      </div>

      <div className="chat-messages" ref={msgRef}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`chat-bubble ${
              m.from === phone ? "sent" : "received"
            }`}
          >
            <div className="bubble-text">
              <b>{m.from === phone ? "You" : m.from}:</b> {m.message}
            </div>
            <div className="bubble-time">{m.time}</div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="chat-input-box">
          <input
            placeholder="Type message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <div className="sender-icon">
            <IoAttach />
            <MdKeyboardVoice />
          </div>
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}
