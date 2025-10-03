import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiClipboard,
  FiUser,
  FiMail,
  FiPhone,
  FiLogOut,
} from "react-icons/fi";

const CustomerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [issuedBooks, setIssuedBooks] = useState([]);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const payloadStr = localStorage.getItem("payload");
    if (payloadStr) setUser(JSON.parse(payloadStr));
  }, []);

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5292/api/Book/allBook");
      setBooks(response.data.book || []);
      console.log(response.data.book)

      // filter books issued to current user
      if (user) {
        const issued = response.data.book.filter(
          (b) => b.issuedby === user.username
        );
        setIssuedBooks(issued);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [user]);

  // Logout handler
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-green-700 text-white h-full transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"
          }`}
      >
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

              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>

              :

              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>


            }
          </button>
        </div>

        <ul className="mt-6">
          <li
            className={`flex items-center p-3 hover:bg-green-600 cursor-pointer text-sm ${!sidebarOpen && "justify-center"
              }`}
          >
            <FiHome className="text-lg" />
            {sidebarOpen && <span className="ml-3">Dashboard</span>}
          </li>


          {/* <li
            className={`flex items-center p-3 hover:bg-green-600 cursor-pointer text-sm ${
              !sidebarOpen && "justify-center"
            }`}
          >
            <FiBook className="text-lg" />
            {sidebarOpen && <span className="ml-3">Browse Books</span>}
          </li> */}


          {/* <li
            className={`flex items-center p-3 hover:bg-green-600 cursor-pointer text-sm ${
              !sidebarOpen && "justify-center"
            }`}
          >
            <FiClipboard className="text-lg" />
            {sidebarOpen && <span className="ml-3">My Issued Books</span>}
          </li> */}


          <li
            className={`flex items-center p-3 hover:bg-green-600 cursor-pointer text-sm ${!sidebarOpen && "justify-center"
              }`} onClick={() => setShowProfileModal(true)}
          >
            <FiUser className="text-lg" />
            {sidebarOpen && <span className="ml-3">Profile</span>}
          </li>



          <li
            className={`flex items-center p-3 hover:bg-red-600 cursor-pointer text-sm ${!sidebarOpen && "justify-center"
              }`}
            onClick={handleLogout}
          >
            <FiLogOut className="text-lg" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </li>
        </ul>
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
          {/* Dashboard Title */}
          <h2 className="text-2xl font-bold mb-6">Customer Dashboard</h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">


            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <p className="text-gray-500">Total Books</p>
              <h3 className="text-2xl font-bold">{books.length}</h3>
            </div>


            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <p className="text-gray-500">My Issued Books</p>
              <h3 className="text-2xl font-bold">{issuedBooks.length}</h3>
            </div>


            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <p className="text-gray-500">Overdue Books</p>
              <h3 className="text-2xl font-bold text-red-500">
                {
                  issuedBooks.filter((b) => new Date(b.dueDate) < new Date())
                    .length
                }
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
              {issuedBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border border-red-400"
                >
                  <p className="text-blue-500">Fine for {book.name}</p>
                  <h3 className="text-2xl font-bold text-red-700">
                    {book.overdueDays > 0 ? book.overdueDays * 10 : 0}
                  </h3>
                </div>
              ))}
            </div>



          </div>

          {/* My Issued Books Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">My Issued Books</h3>
            {issuedBooks.length === 0 ? (
              <p className="text-gray-500">No books issued yet </p>
            ) : (
              <ul className="divide-y">
                {issuedBooks.map((book) => (
                  <li key={book.id} className="py-2 flex gap-2 ">
                    <span className="font-medium border border-gray-300 p-2 rounded-2xl">{book.name}</span>


                    <span className="flex gap-3">

                      <span className="text-blue-500 border border-blue-300 p-2 rounded-2xl flex gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock-arrow-up-icon lucide-clock-arrow-up"><path d="M12 6v6l1.56.78" /><path d="M13.227 21.925a10 10 0 1 1 8.767-9.588" /><path d="m14 18 4-4 4 4" /><path d="M18 22v-8" /></svg>
                        {book.issueDate
                          ? new Date(book.issueDate).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                          : "-"}</span>

                      <span className="text-red-500 border border-red-300 p-2 rounded-2xl flex gap-2">

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock-arrow-down-icon lucide-clock-arrow-down"><path d="M12 6v6l2 1" /><path d="M12.337 21.994a10 10 0 1 1 9.588-8.767" /><path d="m14 18 4 4 4-4" /><path d="M18 14v8" /></svg>{book.dueDate
                          ? new Date(book.dueDate).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                          : "-"}</span>


                      <span className="text-red-500 border border-red-300 p-2 rounded-2xl flex gap-2">

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock-arrow-down-icon lucide-clock-arrow-down"><path d="M12 6v6l2 1" /><path d="M12.337 21.994a10 10 0 1 1 9.588-8.767" /><path d="m14 18 4 4 4-4" /><path d="M18 14v8" /></svg>
                        overdueDays =
                        {book.overdueDays}

                      </span>




                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Browse Books */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Available Books</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="border rounded-lg p-4 shadow hover:shadow-md transition"
                >
                  <h4 className="font-bold">{book.name}</h4>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  {book.issuedby ? (
                    <div className="flex flex-col">
                      <span className="text-blue-500 text-xs">Issued By : {book.issuedby}</span>
                      <span className="text-red-500 text-xs">Not Available</span>
                    </div>
                  ) : (
                    <span className="text-green-600 text-xs">Available</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-50 z-50">
            <div className="bg-white rounded-xl shadow-xl w-96 p-6 relative">
              {/* Close button */}


              {/* Modal Header */}
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold flex-1">My Profile</span>
                {/* <FiUser className="text-2xl text-green-600" /> */}
              </div>

              {/* Modal Body */}
              {user ? (
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-center">
                    <FiUser className="mr-3 text-green-500" />
                    <span className="font-semibold w-24">Username:</span>
                    <span>{user.username}</span>
                  </div>
                  <div className="flex items-center">
                    <FiMail className="mr-3 text-blue-500" />
                    <span className="font-semibold w-24">Email:</span>
                    <span>{user.email}</span>
                  </div>

                  <div className="flex items-center">
                    <FiPhone className="mr-3 text-indigo-500" />
                    <span className="font-semibold w-24">userId:</span>
                    <span>{user.userId || "N/A"}</span>
                  </div>
                </div>


              ) : (
                <p className="text-gray-500">No profile data available</p>
              )}

              {/* Footer / Actions */}
              <div className="mt-6 flex justify-end">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={() => setShowProfileModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}




      </div>
    </div>
  );
};

export default CustomerDashboard;
