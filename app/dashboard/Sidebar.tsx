"use client";

import { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>("STYLE");

  const handleSelect = (section: "STYLE" | "LENS OPTIONS" | "PAYMENTS" | "ACCOUNT") => {
    setSelectedSection(section);
    const url = new URL(window.location.href);
    url.searchParams.set("section", section);
    window.history.pushState({}, "", url);
    setMenuOpen(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get("section");
    if (section) {
      setSelectedSection(section);
    }
  }, []);

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <header className="flex justify-between items-center h-[76px] px-6 py-4 bg-gray-200 fixed md:hidden z-50">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-black z-50">
          {menuOpen ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-800 text-gray-200 p-4 transition-transform z-40 md:w-64 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Sidebar Content */}
        <div className="flex flex-col gap-6 md:pt-20 mt-[80px] md:mt-0">
          <button
            className={`py-2 px-4 w-full text-left ${selectedSection === "STYLE" ? "bg-gray-700" : "text-white"}`}
            onClick={() => handleSelect("STYLE")}
          >
            STYLE
          </button>
          <button
            className={`py-2 px-4 w-full text-left ${selectedSection === "LENS OPTIONS" ? "bg-gray-700" : "text-white"}`}
            onClick={() => handleSelect("LENS OPTIONS")}
          >
            LENS OPTIONS
          </button>
          <button
            className={`py-2 px-4 w-full text-left ${selectedSection === "PAYMENTS" ? "bg-gray-700" : "text-white"}`}
            onClick={() => handleSelect("PAYMENTS")}
          >
            PAYMENTS
          </button>
          <button
            className={`py-2 px-4 w-full text-left ${selectedSection === "ACCOUNT" ? "bg-gray-700" : "text-white"}`}
            onClick={() => handleSelect("ACCOUNT")}
          >
            ACCOUNT
          </button>
        </div>
      </aside>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </>
  );
}
