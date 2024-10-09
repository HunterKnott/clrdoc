"use client";

import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import HeaderAuth from "@/components/header-auth";

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSelect = (section: "STYLE" | "PAYMENTS" | "ACCOUNT") => {
    // Update the URL query parameter to the selected section
    const url = new URL(window.location.href);
    url.searchParams.set("section", section);
    window.history.pushState({}, "", url); // Change the URL without reloading the page
    setMenuOpen(false); // Close menu after selection on mobile
  };

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
        className={`fixed top-0 left-0 h-full min-h-screen bg-gray-800 text-gray-200 p-4 transition-transform z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:min-h-screen md:w-1/4 lg:w-1/5`}
      >
        {/* Sidebar Content */}
        <div className="flex flex-col gap-6 md:pt-20 mt-[80px] md:mt-0">
          <button className="py-2 px-4 w-full text-white text-left" onClick={() => handleSelect("STYLE")}>
            STYLE
          </button>
          <button className="py-2 px-4 w-full text-white text-left" onClick={() => handleSelect("PAYMENTS")}>
            PAYMENTS
          </button>
          <button className="py-2 px-4 w-full text-white text-left" onClick={() => handleSelect("ACCOUNT")}>
            ACCOUNT
          </button>
        </div>
      </aside>

      {/* Dark overlay when the sidebar is open on mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </>
  );
}
