import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiUsers,
  FiClipboard,
  FiSettings,
  FiLogOut,
  FiInfo
} from "react-icons/fi";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [issue, setIssue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const payloadStr = localStorage.getItem("payload");
    if (payloadStr) setUser(JSON.parse(payloadStr));
  }, []);

  // Navigation menu (without logout)
  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/" },
    { name: "Books", icon: <FiBook />, path: "/book" },
    { name: "Members", icon: <FiUsers />, path: "/customerList" },
    { name: "Issued Books", icon: <FiClipboard />, path: "/issuebook" },
    // { name: "Notice", icon: <FiInfo />, path: "/settings" },
  ];

  const handleMenuClick = (item) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("payload");
      await axios.post("http://localhost:5292/api/Auth/logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  const fetchBook = async () => {
    try {
      const response = await axios.get("http://localhost:5292/api/Book/allBook");
      setBooks(response.data.book || []);

      // books.filter(b => )
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:5292/api/Auth/allUser");
      setUsers(response.data.userlist || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchBook();
  }, []);

  const issuedCount = books.filter(book => book.issuedby).length
  const memCnt = users.filter(user => user.role !="admin" ).length

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-sky-700 text-white h-full transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          {sidebarOpen && (
            <span className="text-2xl font-bold">
              {user?.username?.toUpperCase()}
            </span>
          )}
          <button
            className="text-white focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ?


              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg> :


              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>


            }
          </button>
        </div>

        {/* Menu Items */}
        <ul className="mt-6 flex-1">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`flex items-center p-3 hover:bg-sky-600 cursor-pointer text-sm ${!sidebarOpen && "justify-center"
                }`}
              onClick={() => handleMenuClick(item)}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </li>
          ))}
        </ul>

        {/* Logout (always separate at bottom) */}
        <div className="mt-auto">
          <li
            className={`flex items-center p-3 hover:bg-red-600 cursor-pointer text-sm ${!sidebarOpen && "justify-center"
              }`}
            onClick={handleLogout}
          >
            <span className="text-lg">
              <FiLogOut />
            </span>
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </li>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="bg-white shadow flex items-center justify-between px-6 h-16">
          <h1 className="text-xl font-semibold">
            Welcome, {user?.username || "Guest"}!
          </h1>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto">
          <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

          {/* Stats Cards */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">


            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition relative">
              <p className="text-gray-500">Total Books</p>
              <h3 className="text-2xl font-bold">{books.length}</h3>
              <span className="bottom-2 right-2 absolute  p-1" onClick={()=> {navigate("/book")}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link-icon lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg></span>
            </div>



            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition relative">
              <p className="text-gray-500">Members</p>
              <h3 className="text-2xl font-bold">{memCnt}</h3>
              <span className="bottom-2 right-2 absolute  p-1" onClick={()=> {navigate("/customerList")}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link-icon lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg></span>
            </div>


            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <p className="text-gray-500">Issued Books</p>
              <h3 className="text-2xl font-bold">
                {issuedCount}

              </h3>
            </div>


            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <p className="text-gray-500">Overdue</p>
              <h3 className="text-2xl font-bold text-red-500">0</h3>
            </div>



          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <ul className="space-y-2 text-gray-600">
              <li>📕 Book "Clean Code" was issued to John Doe</li>
              <li>👤 New member "Alice Johnson" registered</li>
              <li>📕 Book "Atomic Habits" was returned</li>
            </ul>
          </div>

          {/* Chart Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Library Overview</h3>
            <div className="h-48 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
              📊 Chart/Analytics will go here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
