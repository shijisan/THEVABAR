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
      className="h-[10vh] fixed top-0 left-0 w-full z-30 flex items-center transition-all bg-red-950 text-yellow-200"
    >
      <div className="flex items-center justify-between w-full px-4 lg:px-8">
        {/* Logo */}
        <h2 className="text-lg font-medium text-white lg:w-1/2">
          THE VA BAR <span className="text-yellow-200">Academy</span>
        </h2>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="p-2 text-yellow-200 lg:hidden focus:outline-none"
        >
          <FontAwesomeIcon ref={expandIconRef} icon={faBars} className={`${isMenuOpen ? "hidden" : ""} h-6`} />
          <FontAwesomeIcon ref={closeIconRef} icon={faXmark} className={`${isMenuOpen ? "" : "hidden"} h-6`} />
        </button>
      </div>

      {/* Navigation Links */}
      <ul
        ref={navListRef}
        className="hidden lg:flex lg:flex-row flex-col justify-center items-center lg:space-x-5 lg:w-1/2 bg-yellow-200 lg:bg-transparent text-red-950 lg:text-yellow-200 absolute lg:relative lg:h-auto h-[90vh] lg:top-0 top-[10vh] left-0 w-full"
      >
        <li className="py-2 lg:py-0"><a href="/">Home</a></li>
        <li className="py-2 lg:py-0"><a href="/courses">Courses</a></li>
        <li className="py-2 lg:py-0"><a href="/certificates">Certificates</a></li>
        <li className="py-2 lg:py-0"><a href="/">Link 3</a></li>
      </ul>
    </nav>
  );
}
