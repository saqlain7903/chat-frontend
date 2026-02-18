import React from "react";
import './Contact.css'
export default function ContactList({
  contacts,
  search,
  setSearch,
  openChat,
  menuOpen,
  setMenuOpen,
  contactInput,
  setContactInput,
  addContact,
  logout,
  selected,
}) {
  return (
    <div className={`contact-list ${selected ? "hide-mobile" : ""}`}>
      <div className="contact-header">
        <input
          className="search-box"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="menu-container">
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            ⋮
          </button>

          {menuOpen && (
            <div className="menu-dropdown">
              <div className="menu-item">
                <input
                  placeholder="Add contact"
                  value={contactInput}
                  onChange={(e) => setContactInput(e.target.value)}
                />
                <button onClick={addContact}>Add</button>
              </div>
              <div className="menu-item">Settings</div>
              <div className="menu-item" onClick={logout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {contacts
        .filter((c) =>
          c.name?.toLowerCase().includes(search.toLowerCase())
        )
        .map((c, i) => (
          <div key={i} className="contact-item" onClick={() => openChat(c)} onDoubleClick={() => toggleNumber(c.phone)}>
            {showNumberMap[c.phone] ? c.phone : c.name || c.phone}
          </div>
        ))}

    </div>
  );
}
