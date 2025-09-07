"use client";
import Link from "next/link";
import React, { useState, useEffect, useContext } from "react";
import "@/Css/Navbar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useScroll } from "@/Hooks/useScroll";
import { checkAccessKey } from "./Cookie";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import SellPopup from "./PopUp";
import { useSession, signIn, signOut } from "next-auth/react";
import { removeAllCookies } from "./Cookie";
import { logoutUser } from "./Logout";
import { LogIn } from "lucide-react";
import { CgMail } from "react-icons/cg";
import { CheckSeller } from "./CheckSeller";
import { NumberContext } from "./NumberContext";
import { checkLogin } from "./checkLogin";
import { fetchImage } from "@/models/FetchImage";
interface NavbarProps {
  page: string;
}

const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const Navbar: React.FC<NavbarProps> = ({ page = "defaultPage" }) => {
  const context = useContext(NumberContext);
  if (context) {
    const { number, setNumber } = context;
    useEffect(() => {
      console.log("number change");
      const id = Cookies.get("id");

      const fetchCart = async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cart/items/${id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        if (result.data == null) {
          setCountCartItems(0);
        } else {
          setCountCartItems(result.data.length);
          setNumber(result.data.length);
        }
      };

      fetchCart();
    }, [number]);
  }

  const [menuActive, setMenuActive] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const adjustedIsScrolled = useScroll();
  const isScrolled = page === "ticket" ? false : adjustedIsScrolled;
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [countCartItems, setCountCartItems] = useState<number>(0);
  const [image, setImage] = useState<string>("");
  const router = useRouter();

  const handleSearchIconClick = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleMenuToggle = () => {
    setMenuActive(!menuActive);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("searchData", searchTerm);
    router.push("/search");
    console.log("Tìm kiếm:", searchTerm);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  // const handleMenuItemClick = (e: React.MouseEvent, route: string) => {
  //   e.preventDefault();
  //   console.log("Redirecting to:", route);
  //   // Implement routing logic here
  // };

  const handleMenuItemClick = async (
    event: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    event.preventDefault(); // Prevent default navigation behavior

    // Check if accessKey is valid
    const isValid = await checkAccessKey();
    if (isValid) {
      // If valid, navigate to the desired page
      console.log("Access granted, navigating to", path);
      router.push(path);
    } else {
      // If not valid, redirect to login page
      console.log("Access denied, redirecting to login");
      router.push("/login");
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/my-cart");
    // Implement cart handling logic here
  };

  // Handle check cookie
  const handleSignInClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    console.log("handleSignInClick is called");

    const isValid = await checkAccessKey();

    // removeCookie('id');

    if (isValid) {
      setIsLoggedIn(true);
      console.log("login success");
      router.push("/");
    } else {
      router.push("/login");
    }
  };

  const handleSellClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    // Fetch seller status
    const check = await checkLogin();
    if (check == "False") {
      window.location.href = "/login";
    } else {
      const status = await CheckSeller();
      console.log("Seller Status: ", status); // Log the status
      // Routing or popup logic
      if (status) {
        router.push("/sell");
      } else {
        console.log("User is not a seller, showing popup");
        setIsPopupVisible(true);
      }
    }
  };
  const closeDropdown = () => {
    setIsPopupVisible(false);
  };

  // Handle show icon when login
  useEffect(() => {
    const fetchAvatar = async () => {
      const id = Cookies.get("id");
      if (id) {
        const { imageUrl: fetchedImageUrl, error } = await fetchImage(id);

        if (fetchedImageUrl) {
          setImage(fetchedImageUrl);
        } else {
          setImage(DEFAULT_IMAGE);
          console.error(`Error fetching image for user ${id}: ${error}`);
        }
      }
    };
    fetchAvatar();
  }, []);

  useEffect(() => {
    // Function to check if the user is logged in by checking for the 'id' cookie
    const checkUserLoginStatus = async () => {
      if (id) {
        setIsLoggedIn(true); // User is logged in
      } else {
        setIsLoggedIn(false); // User is logged out

      }
    };
    const id = Cookies.get("id");
    const fetchCart = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/items/${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (result.data == null) {
        setCountCartItems(0);
      } else {
        setCountCartItems(result.data.length);
      }
    };

    fetchCart(); // Fetch cart items when the component mounts

    // Set up a function to listen for changes in the cookies or storage
    const handleCookieChange = () => {
      checkUserLoginStatus(); // Re-check the login status when cookies change
    };

    // Check the user status when the component mounts
    checkUserLoginStatus();

    // Set an interval to periodically check login status (every second)
    const interval = setInterval(() => {
      handleCookieChange();
    }, 1000); // Adjust the interval duration as needed

    // Cleanup the interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Handle logout
  const handleLogout = async (e: any) => {
    e.preventDefault(); // Prevents Link's default behavior

    await signOut();
    const isLoggedOut = await logoutUser(Cookies.get("id"));
    removeAllCookies();

    if (isLoggedOut) {
      setDropdownVisible(false);
      setIsLoggedIn(false);
      router.push("/login"); // Manually trigger redirect after logout is complete
    } else {
      console.log("Failed to log out. Please try again.");
    }
  };

  const handleEmail = () => {
    window.location.href = "/requestchat"; // Redirects to the /requestchat page
  };
  return (
    <header
      className={`${isScrolled ? "navbarr scrolled" : "navbarr"}`}
      style={{
        backgroundColor: page === "ticket" ? "white" : undefined,
        boxShadow:
          page === "ticket" ? "0 2px 5px rgba(0, 0, 0, 0.2)" : undefined,
      }}
    >
      <div className="navbarr-brand">
        <Link href="/" className="logo">
          <span className="logo-green">Ticket</span>{" "}
          <span
            className="resell"
            style={{ color: page === "ticket" ? "black" : undefined }}
          >
            Resell
          </span>
        </Link>
      </div>

      {/* Toggle Menu Button */}
      <button className="menu-toggle" onClick={handleMenuToggle}>
        <i className="fas fa-bars"></i>
      </button>

      {/* Navigation Links */}
      <nav className={`nav-links ${menuActive ? "active" : ""}`}>
        <ul>
          <li>
            <Link
              href="/"
              style={{ color: page === "ticket" ? "black" : undefined }}
            >
              Trang chủ
            </Link>
          </li>
          <li>
            <Link
              href="#"
              style={{ color: page === "ticket" ? "black" : undefined }}
              onClick={handleSellClick}
            >
              Bán vé
            </Link>
            <SellPopup isVisible={isPopupVisible} onClose={closeDropdown} />
          </li>
          <li>
            <Link
              href="#"
              style={{ color: page === "ticket" ? "black" : undefined }}
            >
            </Link>
          </li>
        </ul>
      </nav>

      <form
        className={`search-form ${isSearchVisible ? "visible" : ""}`}
        onSubmit={handleSearchSubmit}
      >
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
          style={{
            backgroundColor: page === "ticket" ? "rgb(0,0,0,0.1)" : undefined,
          }}
        />
        <button
          type="button"
          className="search-button"
          onClick={handleSearchIconClick}
        >
          <i
            className="fas fa-search"
            style={{ color: page === "ticket" ? "rgb(0,0,0)" : undefined }}
          ></i>
        </button>
      </form>

      <div className="user-section">
        {!isLoggedIn && (
          <button onClick={handleSignInClick} className="sign-in-btn">
            <LogIn size={24} />
          </button>
        )}

        <div className="user-dropdown-wrapper relative">
          {isLoggedIn && (
            <button
              onClick={toggleDropdown}
              aria-label="User"
              className="focus:outline-none"
            >
              <img
                src={image}
                alt="User"
                className="w-8 h-8 rounded-full border-2 border-gray-200"
              />
            </button>
          )}
          {isDropdownVisible && (
            <div className="user-dropdown visible absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="py-1">
                <a
                  href="#"
                  onClick={(e) => handleMenuItemClick(e, "/profileuser")}
                  className="no-underline block px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                    Hồ sơ cá nhân
                  </div>
                </a>

                <a
                  href="#"
                  onClick={(e) => handleMenuItemClick(e, "/history")}
                  className="no-underline block px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Lịch sử mua vé
                  </div>
                </a>
                <a
                  href="#"
                  onClick={(e) => handleMenuItemClick(e, "/my-ticket")}
                  className="no-underline block px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                      ></path>
                    </svg>
                    Vé của bạn
                  </div>
                </a>

                <Link
                  href="/login"
                  onClick={(e) => handleLogout(e)} // Pass event to prevent default
                  className="no-underline block px-3 py-2 text-xs text-red-600 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      ></path>
                    </svg>
                    Đăng xuất
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>

        <div>
          <a href="#" onClick={handleEmail} className="icon-link box-chat">
            <CgMail
              style={{ color: page === "ticket" ? "rgb(0,0,0)" : undefined }} // Applies conditional color
              className="text-4xl"
            />
          </a>
        </div>
        {/* Cart and Notifications */}

        <a
          href="#"
          className="icon-link noti-icon"
          aria-label="Cart"
          onClick={handleCartClick}
        >
          <i
            className="fas fa-shopping-cart"
            style={{ color: page === "ticket" ? "rgb(0,0,0)" : undefined }}
          ></i>
          {countCartItems != 0 && (
            <span className="noti-badge">{countCartItems}</span>
          )}
        </a>

        <a
          href="#"
          className="icon-link noti-icon"
          style={{ color: page === "ticket" ? "rgb(0,0,0)" : undefined }}
          aria-label="Notifications"
        >

        </a>
      </div>
    </header>
  );
};

export default Navbar;
