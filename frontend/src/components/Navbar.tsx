import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, decodeAccessToken, logout } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false); // Controls mobile hamburger menu
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Controls desktop user dropdown
  const [isHome, setIsHome] = useState(location.pathname === "/");
  const [loggedInUser, setLoggedInUser] = useState<ReturnType<typeof decodeAccessToken>>(null);

  // Ref for the user dropdown to detect clicks outside
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsHome(location.pathname === "/");
  }, [location.pathname]);

  const checkAuthStatus = () => {
    console.log("Navbar: Checking auth status...");
    if (isAuthenticated()) {
      const decoded = decodeAccessToken();
      console.log("Navbar: Decoded user from token:", decoded);
      if (decoded && decoded.id && decoded.role) {
        setLoggedInUser(decoded);
        console.log(`Navbar: User ID: ${decoded.id}, Role: ${decoded.role}`);
      } else {
        console.warn("Navbar: Token found but user data is incomplete or invalid. Clearing token.");
        localStorage.removeItem('accessToken');
        setLoggedInUser(null);
      }
    } else {
      console.log("Navbar: User is not authenticated.");
      setLoggedInUser(null);
    }
  };

  useEffect(() => {
    checkAuthStatus();

    window.addEventListener('authStatusChange', checkAuthStatus);
    window.addEventListener('storage', checkAuthStatus);

    // Handle clicks outside the user menu to close it
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('authStatusChange', checkAuthStatus);
      window.removeEventListener('storage', checkAuthStatus);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const loggedOut = await logout();
    if (loggedOut) {
      setIsHamburgerMenuOpen(false); // Close mobile menu
      setIsUserMenuOpen(false); // Close user dropdown
      navigate("/");
    } else {
      console.error("Logout failed. Please try again.");
    }
  };

  // Helper functions for dynamic classes
  const baseNavLinkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? "text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600"
    }`;

  // This dropdownLinkClass is specifically for the mobile menu (white background)
  const dropdownLinkClass = (path: string) =>
    `block px-4 py-2 text-sm transition-colors ${
      location.pathname === path
        ? "text-blue-600 font-semibold bg-gray-100"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  // Determine the background color class for the main navbar row
  const topNavbarBgClass = isHome ? "bg-white" : "bg-white";
  // Determine the background color class for the second navbar row
  const secondNavbarBgClass = isHome ? "bg-white" : "bg-blue-600"; // Changed for visual distinction

  return (
    <nav
      className={`${
        isHome ? "absolute" : "sticky top-0"
      } left-0 w-full z-50 transition`}
    >
      {/* TOP NAVBAR ROW */}
      <div className={`h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 ${topNavbarBgClass} ${!isHome ? 'shadow-md' : ''}`}>
        {/* Left: Logo and Site Title */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/simms.png" // Ensure this path is correct for your logo
            alt="Simms Logo"
            className="h-16 w-18 object-contain drop-shadow-[0_0_8px_white]"
          />
          <span
            className={`text-xl font-bold select-none transition-colors duration-300 ${
              isHome ? "text-black" : "text-blue-600"
            }`}
          >
            Simms India
          </span>
        </Link>

        {/* Right: External Logos, User Dropdown, Mobile Hamburger */}
        <div className="flex items-center space-x-4">
          {/* External Website Logos (Always visible on both desktop and mobile) */}
          <div className="flex items-center space-x-4">
              <a href="https://www.nielit.gov.in/" target="_blank" rel="noopener noreferrer" title="Visit NIELIT Website">
                  <img 
                      src="/NIELIT.png" 
                      alt="NIELIT Logo" 
                      className="h-16 w-18 full" 
                  />
              </a>
              <a href="https://www.msde.gov.in/" target="_blank" rel="noopener noreferrer" title="Visit Ministry Website">
                  <img 
                      src="/Ministry.png" 
                      alt="Ministry Logo" 
                      className="h-10 w-18 full" 
                  />
              </a>
          </div>

          {/* Desktop User/Auth Dropdown (hidden on mobile) */}
          <div className="hidden md:flex relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`flex items-center px-1 py-1 transition ${
                isUserMenuOpen ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:text-blue-600 border-green-500'
              } ${isHome ? "text-black hover:text-blue-200" : "text-gray-700 hover:text-blue-600"}`}
            >
              {loggedInUser ? (
                <>
                  <span className="mr-2 text-black">{loggedInUser.username}</span>
                  <svg className="w-4 h-4" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </>
              ) : (
                <>
                  <span>Account</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </>
              )}
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black rounded-md shadow-lg py-1 z-10 origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none">
                {loggedInUser ? (
                  <>
                    <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                      Profile
                    </Link>
                    {/* Admin-specific links */}
                    {loggedInUser.role === 'admin' && (
                      <>
                        <Link to="/manage-students" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                          Manage Students
                        </Link>
                        <Link to="/certificate-add" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                          Add Certificate
                        </Link>
                        <Link to="/course-add" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                          Add Course
                        </Link>
                        <Link to="/center-affilation" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                          Add Center
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button (hidden on desktop) */}
          <button
            onClick={() => setIsHamburgerMenuOpen(!isHamburgerMenuOpen)}
            className={`md:hidden text-2xl focus:outline-none ${isHome ? "text-black" : "text-gray-700 hover:text-blue-600"}`}
            aria-label="Toggle menu"
          >
            {isHamburgerMenuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {/* SECOND NAVBAR ROW (Desktop Only) */}
      <div className={`hidden md:flex justify-center py-2 ${secondNavbarBgClass} ${!isHome ? 'shadow-md' : ''}`}>
        <div className="flex space-x-6">
          <Link
            to="/"
            className={`${isHome ? "text-black" : "text-white"} ${baseNavLinkClass("/")}`}
          >
            Home
          </Link>
          <Link to="/courses" className={`${isHome ? "text-black" : "text-white"} ${baseNavLinkClass("/courses")}`}>Courses</Link>
          <Link to="/certificate" className={`${isHome ? "text-black" : "text-white"} ${baseNavLinkClass("/certificate")}`}>Certificate Search</Link>
          <Link to="/center-list" className={`${isHome ? "text-black" : "text-white"} ${baseNavLinkClass("/center-list")}`}>Centers</Link>
          {/* Student Admission link - always visible in sub-navbar */}
          <Link 
            to={loggedInUser ? "/studentadmission" : "/login"} 
            className={`${isHome ? "text-black" : "text-white"} ${baseNavLinkClass("/studentadmission")}`}
          >
            Admission
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Menu (contains all nav links and user options, NO external logos) */}
      <div
        className={`md:hidden bg-white border-t overflow-hidden transition-all duration-300 ease-in-out ${
          isHamburgerMenuOpen ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" onClick={() => setIsHamburgerMenuOpen(false)} className={dropdownLinkClass("/")}>
            Home
          </Link>
          <Link to="/courses" onClick={() => setIsHamburgerMenuOpen(false)} className={dropdownLinkClass("/courses")}>Courses</Link>
          <Link to="/certificate" onClick={() => setIsHamburgerMenuOpen(false)} className={dropdownLinkClass("/certificate")}>Certificate Search</Link>
          <Link to="/center-list" onClick={() => setIsHamburgerMenuOpen(false)} className={dropdownLinkClass("/center-list")}>Centers</Link>

          {/* Student Admission link - always visible in mobile menu */}
          <Link
            to={loggedInUser ? "/studentadmission" : "/login"}
            onClick={() => setIsHamburgerMenuOpen(false)}
            className={dropdownLinkClass("/studentadmission")}
          >
            Admission
          </Link>

          {loggedInUser ? (
            <>
              <Link
                to="/profile"
                onClick={() => setIsHamburgerMenuOpen(false)}
                className={dropdownLinkClass("/profile")}
              >
                Profile
              </Link>
              {loggedInUser.role === 'admin' && (
                <>
                
                  <Link
                    to="/manage-students"
                    onClick={() => setIsHamburgerMenuOpen(false)}
                    className={dropdownLinkClass("/admin/manage-students")}
                  >
                    Manage Students
                  </Link>
                  <Link
                    to="/certificate-add"
                    onClick={() => setIsHamburgerMenuOpen(false)}
                    className={dropdownLinkClass("/certificate-add")}
                  >
                    Add Certificate
                  </Link>
                  <Link
                    to="/course-add"
                    onClick={() => setIsHamburgerMenuOpen(false)}
                    className={dropdownLinkClass("/course-add")}
                  >
                    Add Course
                  </Link>
                  <Link
                    to="/center-affilation"
                    onClick={() => setIsHamburgerMenuOpen(false)}
                    className={dropdownLinkClass("/center-affilation")}
                  >
                    Add Center
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-500 hover:bg-red-600 text-white transition mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsHamburgerMenuOpen(false)}
                className="block bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsHamburgerMenuOpen(false)}
                className="block bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition mt-1"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}