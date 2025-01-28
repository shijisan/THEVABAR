"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";

export default function NavBar() {
  const navRef = useRef(null);
  const navListRef = useRef(null);
  const expandIconRef = useRef(null);
  const closeIconRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Removed the scroll effect

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    if (navListRef.current && expandIconRef.current && closeIconRef.current) {
      navListRef.current.classList.toggle("flex");
      navListRef.current.classList.toggle("hidden");
      expandIconRef.current.classList.toggle("hidden");
      closeIconRef.current.classList.toggle("hidden");
    }
  };

  return (
    <nav
      ref={navRef}
      className="h-[10vh] fixed top-0 left-0 w-full z-30 flex items-center transition-all bg-red-950 text-yellow- px-4"
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <h2 className="text-lg font-medium text-white md:text-2xl">
          THE VA BAR <span className="text-yellow-200">Academy</span>
        </h2>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="p-2 text-yellow-200 md:hidden focus:outline-none"
        >
          <FontAwesomeIcon ref={expandIconRef} icon={faBars} className={`${isMenuOpen ? "hidden" : ""} h-6`} />
          <FontAwesomeIcon ref={closeIconRef} icon={faXmark} className={`${isMenuOpen ? "" : "hidden"} h-6`} />
        </button>
      </div>

      {/* Navigation Links */}
      <ul
        ref={navListRef}
        className="hidden md:flex md:flex-row flex-col justify-evenly items-center md:w-1/2 bg-yellow-200 md:bg-transparent text-red-950 md:text-yellow-200 absolute md:relative md:h-auto h-[90vh] md:top-0 top-[10vh] left-0 w-full"
      >
        <li className=""><a href="/">Home</a></li>
        <li className=""><a href="/courses">Courses</a></li>
        <li className=""><a href="/certificates">Certificates</a></li>
        <li className=""><a href="/">Link 3</a></li>
      </ul>
    </nav>
  );
}
