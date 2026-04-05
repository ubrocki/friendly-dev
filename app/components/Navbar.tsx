import { useState } from "react";
import { FaBars, FaLaptopCode, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1 rounded-md transition-colors duration-200 ${
      isActive
        ? "bg-blue-500/20 text-blue-400"
        : "text-gray-300 hover:text-white hover:bg-gray-700"
    }`;

  return (
    <nav className="bg-gray-800 border-gray-700 shadow-md sticky top-0 z-50">
      <div className="max-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-blue-300"
        >
          <FaLaptopCode className="text-blue-400 text-xl" />
          <span>The Friendly Developer</span>
        </NavLink>

        {/* Desktop Navifigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/projects" className={navLinkClass}>
              Projects
            </NavLink>
            <NavLink to="/blog" className={navLinkClass}>
              Blog
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </div>
        </div>
        <div className="md:hidden flex items-center gap-4" title="Menu">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-blue-400 text-xl cursor-pointer"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink
              to="/"
              end
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/projects"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </NavLink>
            <NavLink
              to="/blog"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </NavLink>
            <NavLink
              to="/about"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
